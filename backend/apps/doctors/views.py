from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.crypto import get_random_string
from common.permissions import IsAdmin
from common.responses import success_response, error_response
from apps.accounts.models import User
from .models import Doctor, Attendance
from .serializers import DoctorSerializer, DoctorListSerializer, AttendanceSerializer


class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.filter(is_active=True)
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization']
    search_fields = ['first_name', 'last_name', 'email', 'license_number']
    ordering_fields = ['first_name', 'experience_years']

    def get_serializer_class(self):
        return DoctorListSerializer if self.request.method == 'GET' else DoctorSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            password = request.data.get('password')
            doctor = serializer.save()

            user_defaults = {
                'first_name': doctor.first_name,
                'last_name': doctor.last_name,
                'role': 'doctor',
                'phone': doctor.phone or ''
            }
            user, created = User.objects.get_or_create(
                email=doctor.email,
                defaults=user_defaults
            )

            if created:
                generated_password = password or get_random_string(12)
                user.set_password(generated_password)
                user.role = 'doctor'
                user.save()
                credentials = {'email': user.email, 'password': generated_password}
            else:
                if password:
                    user.set_password(password)
                    user.save()
                    credentials = {'email': user.email, 'password': password}
                else:
                    credentials = {'email': user.email}

            doctor.user = user
            doctor.save()

            return success_response(
                data={
                    'doctor': DoctorSerializer(doctor).data,
                    'credentials': credentials
                },
                message='Doctor created successfully.',
                status_code=status.HTTP_201_CREATED
            )
        return error_response(errors=serializer.errors)


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer

    def get_permissions(self):
        from rest_framework.permissions import IsAuthenticated
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]

    def perform_update(self, serializer):
        doctor = serializer.save()
        if doctor.user:
            user = doctor.user
            user.email = doctor.email
            user.first_name = doctor.first_name
            user.last_name = doctor.last_name
            user.save()

    def destroy(self, request, *args, **kwargs):
        doctor = self.get_object()
        doctor.is_active = False
        doctor.save()
        return success_response(message="Doctor removed")
class AttendanceView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['doctor', 'date', 'status']
    ordering_fields = ['date']
    def get_permissions(self):
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Doctors can only self-checkin
        if self.request.user.role == 'doctor':
            doctor = Doctor.objects.get(user=self.request.user)
            serializer.save(doctor=doctor)
        else:
            serializer.save()

class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    
    def get_permissions(self):
        return [IsAdmin()]
