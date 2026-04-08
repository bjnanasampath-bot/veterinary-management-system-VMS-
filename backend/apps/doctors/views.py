from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from apps.accounts.models import User
from .models import Doctor
from .serializers import DoctorSerializer, DoctorListSerializer


class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.filter(is_active=True)
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
            doctor = serializer.save()
            # Automatically create User for this doctor if not exists
            user, created = User.objects.get_or_create(
                email=doctor.email,
                defaults={
                    'first_name': doctor.first_name,
                    'last_name': doctor.last_name,
                    'role': 'doctor',
                    'phone': doctor.phone
                }
            )
            if created:
                user.set_password('doctor123')
                user.save()
            doctor.user = user
            doctor.save()
            
            return success_response(
                data=DoctorSerializer(doctor).data, 
                message=f"Doctor created. Login password is 'doctor123'.", 
                status_code=status.HTTP_201_CREATED
            )
        return error_response(errors=serializer.errors)


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer

    def destroy(self, request, *args, **kwargs):
        doctor = self.get_object()
        doctor.is_active = False
        doctor.save()
        return success_response(message="Doctor removed")
