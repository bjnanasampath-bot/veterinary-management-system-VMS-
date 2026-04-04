from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Vaccination
from .serializers import VaccinationSerializer
from datetime import date


class VaccinationListCreateView(generics.ListCreateAPIView):
    serializer_class = VaccinationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pet', 'status', 'doctor']
    search_fields = ['vaccine_name', 'pet__name', 'batch_number']
    ordering_fields = ['vaccination_date', 'next_due_date']

    def get_queryset(self):
        qs = Vaccination.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = VaccinationSerializer(data=request.data)
        if serializer.is_valid():
            vacc = serializer.save()
            return success_response(data=VaccinationSerializer(vacc).data, message="Vaccination recorded", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class VaccinationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VaccinationSerializer

    def get_queryset(self):
        qs = Vaccination.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        return qs


class OverdueVaccinationsView(APIView):
    def get(self, request):
        qs = Vaccination.objects.filter(
            next_due_date__lt=date.today(),
            status__in=['scheduled']
        ).select_related('pet', 'doctor')
        
        if request.user.role == 'client':
            qs = qs.filter(pet__owner__user=request.user)
            
        return success_response(data=VaccinationSerializer(qs, many=True).data)


class UpcomingVaccinationsView(APIView):
    def get(self, request):
        from datetime import timedelta
        today = date.today()
        qs = Vaccination.objects.filter(
            next_due_date__gte=today,
            next_due_date__lte=today + timedelta(days=30),
            status='scheduled'
        ).select_related('pet', 'doctor')
        
        if request.user.role == 'client':
            qs = qs.filter(pet__owner__user=request.user)
            
        return success_response(data=VaccinationSerializer(qs, many=True).data)
