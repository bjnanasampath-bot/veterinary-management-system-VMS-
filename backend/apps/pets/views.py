from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Pet
from .serializers import PetSerializer, PetListSerializer, PetDetailSerializer


class PetListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['species', 'gender', 'owner']
    search_fields = ['name', 'breed', 'microchip_id', 'owner__first_name', 'owner__last_name']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        qs = Pet.objects.filter(is_active=True).select_related('owner')
        if self.request.user.role == 'client':
            from django.db.models import Q
            return qs.filter(Q(owner__user=self.request.user) | Q(owner__email=self.request.user.email))
        return qs

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PetListSerializer
        return PetSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            pet = serializer.save()
            return success_response(data=PetSerializer(pet).data, message="Pet added", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PetDetailSerializer

    def get_queryset(self):
        qs = Pet.objects.filter(is_active=True).select_related('owner')
        if self.request.user.role == 'client':
            return qs.filter(owner__user=self.request.user)
        return qs

    def destroy(self, request, *args, **kwargs):
        pet = self.get_object()
        pet.is_active = False
        pet.save()
        return success_response(message="Pet removed")


class PetMedicalHistoryView(generics.RetrieveAPIView):
    def get_queryset(self):
        qs = Pet.objects.filter(is_active=True)
        if self.request.user.role == 'client':
            return qs.filter(owner__user=self.request.user)
        return qs

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
