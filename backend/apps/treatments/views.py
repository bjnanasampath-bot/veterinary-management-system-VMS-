from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Treatment
from .serializers import TreatmentSerializer


class TreatmentListCreateView(generics.ListCreateAPIView):
    serializer_class = TreatmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pet', 'doctor', 'follow_up_required']
    search_fields = ['treatment_name', 'diagnosis', 'pet__name']
    ordering_fields = ['treatment_date', 'created_at']

    def get_queryset(self):
        qs = Treatment.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = TreatmentSerializer(data=request.data)
        if serializer.is_valid():
            treatment = serializer.save()
            
            # Automatic Billing Logic
            try:
                from apps.billing.models import Bill, BillItem
                from django.db import transaction
                
                with transaction.atomic():
                    # Create a Draft Bill
                    bill = Bill.objects.create(
                        pet=treatment.pet,
                        appointment=treatment.appointment,
                        created_by=request.user,
                        status='draft',
                        notes=f"Clinical bill generated from treatment: {treatment.treatment_name}"
                    )
                    
                    subtotal = 0
                    
                    # 1. Consultation Fee
                    if treatment.doctor and treatment.doctor.consultation_fee > 0:
                        fee = treatment.doctor.consultation_fee
                        BillItem.objects.create(
                            bill=bill,
                            description=f"Consultation Fee - {treatment.doctor.full_name}",
                            item_type='consultation',
                            unit_price=fee,
                            quantity=1,
                            total_price=fee
                        )
                        subtotal += fee
                        
                    # 2. Treatment Cost
                    if treatment.cost > 0:
                        BillItem.objects.create(
                            bill=bill,
                            description=f"Treatment: {treatment.treatment_name}",
                            item_type='treatment',
                            unit_price=treatment.cost,
                            quantity=1,
                            total_price=treatment.cost
                        )
                        subtotal += treatment.cost
                        
                    # Calculate Totals (18% tax by default in model)
                    bill.subtotal = subtotal
                    bill.tax_amount = (subtotal * bill.tax_percent) / 100
                    bill.total_amount = subtotal + bill.tax_amount
                    bill.save()
            except Exception as e:
                print(f"Error generating automatic bill: {e}")
                # We don't fail the treatment creation if billing fails
            
            return success_response(data=TreatmentSerializer(treatment).data, message="Treatment recorded and Draft Bill generated", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class TreatmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        qs = Treatment.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        return qs


from .models import LabTest, Surgery
from .serializers import LabTestSerializer, SurgerySerializer

class LabTestListCreateView(generics.ListCreateAPIView):
    serializer_class = LabTestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pet', 'doctor', 'status']
    search_fields = ['test_name', 'pet__name']
    ordering_fields = ['test_date', 'created_at']

    def get_queryset(self):
        qs = LabTest.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'doctor':
            return qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none() 
        return qs

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return success_response(data=LabTestSerializer(item).data, status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class LabTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LabTestSerializer

    def get_queryset(self):
        qs = LabTest.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'doctor':
            return qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none()
        return qs


class SurgeryListCreateView(generics.ListCreateAPIView):
    serializer_class = SurgerySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pet', 'doctor', 'status']
    search_fields = ['surgery_name', 'pet__name']
    ordering_fields = ['surgery_date', 'created_at']

    def get_queryset(self):
        qs = Surgery.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'doctor':
            return qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none() 
        return qs

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return success_response(data=SurgerySerializer(item).data, status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class SurgeryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SurgerySerializer

    def get_queryset(self):
        qs = Surgery.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'doctor':
            return qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none()
        return qs
