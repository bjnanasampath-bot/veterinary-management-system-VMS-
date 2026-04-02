from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Bill, BillItem
from .serializers import BillSerializer, BillListSerializer, BillItemSerializer


class BillListCreateView(generics.ListCreateAPIView):
    queryset = Bill.objects.select_related('pet', 'pet__owner').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['bill_number', 'pet__name', 'pet__owner__first_name']
    ordering_fields = ['created_at', 'total_amount']

    def get_serializer_class(self):
        return BillListSerializer if self.request.method == 'GET' else BillSerializer

    def create(self, request, *args, **kwargs):
        serializer = BillSerializer(data=request.data)
        if serializer.is_valid():
            bill = serializer.save(created_by=request.user)
            return success_response(data=BillSerializer(bill).data, message="Bill created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class BillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bill.objects.select_related('pet', 'pet__owner').prefetch_related('items').all()
    serializer_class = BillSerializer

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object()
        bill.status = 'cancelled'
        bill.save()
        return success_response(message="Bill cancelled")


class BillPaymentView(APIView):
    def post(self, request, pk):
        try:
            bill = Bill.objects.get(pk=pk)
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
