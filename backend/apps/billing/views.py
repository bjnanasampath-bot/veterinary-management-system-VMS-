from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from common.responses import success_response, error_response
from .models import Bill, BillItem
from .serializers import BillSerializer, BillListSerializer, BillItemSerializer


class BillListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['bill_number', 'pet__name', 'pet__owner__first_name']
    ordering_fields = ['created_at', 'total_amount']

    def get_queryset(self):
        qs = Bill.objects.select_related('pet', 'pet__owner').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user).exclude(status='draft')
        return qs

    def get_serializer_class(self):
        return BillListSerializer if self.request.method == 'GET' else BillSerializer

    def create(self, request, *args, **kwargs):
        serializer = BillSerializer(data=request.data)
        if serializer.is_valid():
            bill = serializer.save(created_by=request.user)
            return success_response(data=BillSerializer(bill).data, message="Bill created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class BillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BillSerializer

    def get_queryset(self):
        qs = Bill.objects.select_related('pet', 'pet__owner').prefetch_related('items').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user).exclude(status='draft')
        return qs

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object()
        bill.status = 'cancelled'
        bill.save()
        return success_response(message="Bill cancelled")


class BillPaymentView(APIView):
    def post(self, request, pk):
        try:
            qs = Bill.objects.all()
            if request.user.role == 'client':
                qs = qs.filter(pet__owner__user=request.user)
            bill = qs.get(pk=pk)
            paid_amount = request.data.get('paid_amount', 0)
            payment_method = request.data.get('payment_method', 'cash')
            from datetime import datetime
            bill.paid_amount = float(bill.paid_amount) + float(paid_amount)
            bill.payment_method = payment_method
            bill.payment_date = datetime.now()
            if bill.paid_amount >= float(bill.total_amount):
                bill.status = 'paid'
            else:
                bill.status = 'partial'
            bill.save()
            return success_response(data=BillSerializer(bill).data, message="Payment recorded")
        except Bill.DoesNotExist:
            return error_response(message="Bill not found", status_code=404)


class BillSendEmailView(APIView):
    def post(self, request, pk):
        try:
            qs = Bill.objects.select_related('pet', 'pet__owner').prefetch_related('items')
            if request.user.role == 'client':
                qs = qs.filter(pet__owner__user=request.user)
            bill = qs.get(pk=pk)
            owner = bill.pet.owner
            
            # Simple text email content
            subject = f"Invoice from VetCare - #{bill.bill_number}"
            item_list = "\n".join([f"- {i.description}: ₹{i.total_price} (Qty: {i.quantity})" for i in bill.items.all()])
            
            message = f"""
Dear {owner.full_name},

Please find the invoice details for {bill.pet.name} below:

Bill Number: {bill.bill_number}
Date: {bill.created_at.strftime('%Y-%m-%d')}
Status: {bill.status.upper()}

Items:
{item_list}

Subtotal: ₹{bill.subtotal}
Discount: -₹{bill.discount_amount}
Tax: +₹{bill.tax_amount}
Total Amount: ₹{bill.total_amount}

Paid: ₹{bill.paid_amount}
Due: ₹{bill.due_amount}

Payment Method: {bill.payment_method or 'N/A'}
Due Date: {bill.due_date if bill.due_date else 'N/A'}

Thank you for choosing VetCare!
"""
            
            send_mail(
                subject,
                message,
                'no-reply@vetcare.com',
                [owner.email],
                fail_silently=False,
            )
            
            return success_response(message=f"Bill sent to {owner.email}")
        except Bill.DoesNotExist:
            return error_response(message="Bill not found", status_code=404)
        except Exception as e:
            return error_response(message=str(e), status_code=500)
