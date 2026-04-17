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
        # Auto-generate bill on completion
        if old_status != 'completed' and instance.status == 'completed':
            from apps.billing.models import Bill, BillItem
            if not Bill.objects.filter(appointment=instance).exists():
                bill = Bill.objects.create(
                    pet=instance.pet,
                    appointment=instance,
                    created_by=self.request.user if self.request.user.is_authenticated else None,
                    status='pending',
                )
                BillItem.objects.create(
                    bill=bill,
                    description=f"Consultation - {instance.get_appointment_type_display()}",
                    item_type="consultation",
                    unit_price=500.00, # Example generic fee
                )
                bill.subtotal = 500.00
                bill.tax_percent = 0 # No tax simplified
                bill.tax_amount = 0
                bill.total_amount = 500.00
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
