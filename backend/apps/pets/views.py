from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Pet
from .serializers import PetSerializer, PetListSerializer, PetDetailSerializer


class PetListCreateView(generics.ListCreateAPIView):
    queryset = Pet.objects.filter(is_active=True).select_related('owner')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['species', 'gender', 'owner']
    search_fields = ['name', 'breed', 'microchip_id', 'owner__first_name', 'owner__last_name']
    ordering_fields = ['name', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PetListSerializer
        return PetSerializer

    def create(self, request, *args, **kwargs):
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            pet = serializer.save()
            return success_response(data=PetSerializer(pet).data, message="Pet added", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.filter(is_active=True).select_related('owner')
    serializer_class = PetDetailSerializer

    def destroy(self, request, *args, **kwargs):
        pet = self.get_object()
        pet.is_active = False
        pet.save()
        return success_response(message="Pet removed")


class PetMedicalHistoryView(generics.RetrieveAPIView):
    queryset = Pet.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        pet = self.get_object()
        from apps.treatments.serializers import TreatmentSerializer
        from apps.vaccinations.serializers import VaccinationSerializer
        from apps.appointments.serializers import AppointmentSerializer

        data = {
            'pet': PetDetailSerializer(pet).data,
            'treatments': TreatmentSerializer(pet.treatments.all().order_by('-created_at'), many=True).data,
            'vaccinations': VaccinationSerializer(pet.vaccinations.all().order_by('-vaccination_date'), many=True).data,
            'appointments': AppointmentSerializer(pet.appointments.all().order_by('-appointment_date'), many=True).data,
        }
        return success_response(data=data)
