from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentDetailSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.select_related('pet', 'doctor', 'pet__owner').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'appointment_type', 'doctor', 'appointment_date']
    search_fields = ['pet__name', 'doctor__first_name', 'pet__owner__first_name']
    ordering_fields = ['appointment_date', 'created_at']

    def get_serializer_class(self):
        return AppointmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(booked_by=request.user)
            return success_response(data=AppointmentSerializer(appointment).data, message="Appointment created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.select_related('pet', 'doctor', 'pet__owner').all()
    serializer_class = AppointmentDetailSerializer

    def destroy(self, request, *args, **kwargs):
        appt = self.get_object()
        appt.status = 'cancelled'
        appt.save()
        return success_response(message="Appointment cancelled")


class AppointmentStatusUpdateView(APIView):
    def patch(self, request, pk):
        try:
            appt = Appointment.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status not in dict(Appointment.STATUS_CHOICES):
                return error_response(message="Invalid status")
            appt.status = new_status
            appt.save()
            return success_response(data=AppointmentSerializer(appt).data, message="Status updated")
        except Appointment.DoesNotExist:
            return error_response(message="Appointment not found", status_code=404)


class TodayAppointmentsView(APIView):
    def get(self, request):
        from datetime import date
        today = date.today()
        appointments = Appointment.objects.filter(appointment_date=today).select_related('pet', 'doctor')
        return success_response(data=AppointmentSerializer(appointments, many=True).data)
