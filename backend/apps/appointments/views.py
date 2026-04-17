from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentDetailSerializer

from .filters import AppointmentFilter

class AppointmentListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AppointmentFilter
    search_fields = ['pet__name', 'doctor__first_name', 'pet__owner__first_name']
    ordering_fields = ['appointment_date', 'created_at']

    def get_queryset(self):
        qs = Appointment.objects.select_related('pet', 'doctor', 'pet__owner').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        elif self.request.user.role == 'doctor':
            try:
                return qs.filter(doctor=self.request.user.doctor_profile)
            except AttributeError:
                return qs.none()
        return qs

    def get_serializer_class(self):
        return AppointmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(booked_by=request.user)
            return success_response(data=AppointmentSerializer(appointment).data, message="Appointment created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentDetailSerializer

    def get_queryset(self):
        qs = Appointment.objects.select_related('pet', 'doctor', 'pet__owner').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        elif self.request.user.role == 'doctor':
            try:
                return qs.filter(doctor=self.request.user.doctor_profile)
            except:
                return qs.none()
        return qs

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        instance = serializer.save()
        
        # We can extract custom frontend fields from request data
        doctor_fee = self.request.data.get('doctor_fee', 500.00)
        payment_mode = self.request.data.get('payment_mode', 'pending')
        selected_medicines = self.request.data.get('selected_medicines', [])

        # Auto-generate bill on completion
        if old_status != 'completed' and instance.status == 'completed':
            from apps.billing.models import Bill, BillItem
            if not Bill.objects.filter(appointment=instance).exists():
                bill_status = 'paid' if payment_mode in ['online', 'offline'] else 'pending'
                pmt_method = 'online' if payment_mode == 'online' else ('cash' if payment_mode == 'offline' else '')

                bill = Bill.objects.create(
                    pet=instance.pet,
                    appointment=instance,
                    created_by=self.request.user if self.request.user.is_authenticated else None,
                    status=bill_status,
                    payment_method=pmt_method,
                )
                
                total_amount = float(doctor_fee)
                
                # Consultation Fee Item
                BillItem.objects.create(
                    bill=bill,
                    description=f"Consultation - {instance.get_appointment_type_display()}",
                    item_type="consultation",
                    quantity=1,
                    unit_price=doctor_fee,
                    total_price=doctor_fee
                )

                # Pharmacy Items & Prescriptions
                from apps.pharmacy.models import PharmacyItem, Prescription
                prescriptions = []
                for item_data in selected_medicines:
                    try:
                        if isinstance(item_data, dict):
                            med_id = item_data.get('id')
                            dosage = item_data.get('dosage', '1 Tablet')
                            frequency = item_data.get('frequency', 'As prescribed')
                            duration = int(item_data.get('days', 3))
                        else:
                            med_id = item_data
                            dosage = '1 Tablet'
                            frequency = 'As prescribed'
                            duration = 3

                        med = PharmacyItem.objects.get(id=med_id)
                        total_amount += float(med.unit_price)
                        BillItem.objects.create(
                            bill=bill,
                            description=f"Medicine: {med.name}",
                            item_type="medication",
                            quantity=1,
                            unit_price=med.unit_price,
                            total_price=med.unit_price
                        )
                        prescriptions.append(f"{med.name} ({dosage}, {frequency} x {duration} days)")
                        
                        # Create actual Prescription Record
                        Prescription.objects.create(
                            pet=instance.pet,
                            doctor=instance.doctor,
                            medication=med,
                            medication_name=med.name,
                            dosage=dosage,
                            frequency=frequency,
                            duration_days=duration,
                            notes=instance.prescription or ""
                        )
                        
                        # Decrease stock
                        if med.stock_quantity > 0:
                            med.stock_quantity -= 1
                            med.save()
                    except Exception as e:
                        print("Error adding medicine", e)
                
                # Update appointment prescription text if medicines were selected
                if prescriptions:
                    existing_text = instance.prescription + "\n" if instance.prescription else ""
                    instance.prescription = existing_text + "Prescribed: " + ", ".join(prescriptions)
                    instance.save()

                bill.subtotal = total_amount
                bill.tax_percent = 0 # No tax simplified
                bill.tax_amount = 0
                bill.total_amount = total_amount
                
                # If paid, set paid amount
                if bill_status == 'paid':
                    bill.paid_amount = total_amount
                    from django.utils import timezone
                    bill.payment_date = timezone.now()
                
                bill.save()

    def destroy(self, request, *args, **kwargs):
        appt = self.get_object()
        appt.status = 'cancelled'
        appt.save()
        return success_response(message="Appointment cancelled")


class AppointmentStatusUpdateView(APIView):
    def patch(self, request, pk):
        try:
            qs = Appointment.objects.all()
            if request.user.role == 'client':
                qs = qs.filter(pet__owner__user=request.user)
            elif request.user.role == 'doctor':
                qs = qs.filter(doctor=request.user.doctor_profile)
            appt = qs.get(pk=pk)
            new_status = request.data.get('status')
            if new_status not in dict(Appointment.STATUS_CHOICES):
                return error_response(message="Invalid status")
            old_status = appt.status
            appt.status = new_status
            appt.save()
            
            # Auto-generate bill on completion
            if old_status != 'completed' and new_status == 'completed':
                from apps.billing.models import Bill, BillItem
                if not Bill.objects.filter(appointment=appt).exists():
                    bill = Bill.objects.create(
                        pet=appt.pet,
                        appointment=appt,
                        created_by=request.user if request.user.is_authenticated else None,
                        status='pending',
                    )
                    BillItem.objects.create(
                        bill=bill,
                        description=f"Consultation - {appt.get_appointment_type_display()}",
                        item_type="consultation",
                        unit_price=500.00,
                    )
                    bill.subtotal = 500.00
                    bill.total_amount = 500.00
                    bill.save()
            
            return success_response(data=AppointmentSerializer(appt).data, message="Status updated")
        except Appointment.DoesNotExist:
            return error_response(message="Appointment not found", status_code=404)


class TodayAppointmentsView(APIView):
    def get(self, request):
        from datetime import date
        today = date.today()
        qs = Appointment.objects.filter(appointment_date=today).select_related('pet', 'doctor')
        if request.user.role == 'client':
            qs = qs.filter(pet__owner__user=request.user)
        elif request.user.role == 'doctor':
            try:
                qs = qs.filter(doctor=request.user.doctor_profile)
            except:
                qs = qs.none()
        return success_response(data=AppointmentSerializer(qs, many=True).data)
