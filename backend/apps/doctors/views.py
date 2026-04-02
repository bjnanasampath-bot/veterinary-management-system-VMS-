from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
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

    def create(self, request, *args, **kwargs):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()
            return success_response(data=DoctorSerializer(doctor).data, message="Doctor created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer

    def destroy(self, request, *args, **kwargs):
        doctor = self.get_object()
        doctor.is_active = False
        doctor.save()
        return success_response(message="Doctor removed")
