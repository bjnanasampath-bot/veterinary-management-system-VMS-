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
            return success_response(data=TreatmentSerializer(treatment).data, message="Treatment recorded", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class TreatmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        qs = Treatment.objects.select_related('pet', 'doctor').all()
        if self.request.user.role == 'client':
            return qs.filter(pet__owner__user=self.request.user)
        return qs
