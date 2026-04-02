from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Owner
from .serializers import OwnerSerializer, OwnerListSerializer


class OwnerListCreateView(generics.ListCreateAPIView):
    queryset = Owner.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['first_name', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OwnerListSerializer
        return OwnerSerializer

    def create(self, request, *args, **kwargs):
        serializer = OwnerSerializer(data=request.data)
        if serializer.is_valid():
            owner = serializer.save()
            return success_response(data=OwnerSerializer(owner).data, message="Owner created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class OwnerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Owner.objects.filter(is_active=True)
    serializer_class = OwnerSerializer

    def destroy(self, request, *args, **kwargs):
        owner = self.get_object()
        owner.is_active = False
        owner.save()
        return success_response(message="Owner deleted")


class OwnerPetsView(APIView):
    def get(self, request, pk):
        try:
            owner = Owner.objects.get(pk=pk, is_active=True)
            from apps.pets.serializers import PetSerializer
            pets = owner.pets.filter(is_active=True)
            return success_response(data=PetSerializer(pets, many=True).data)
        except Owner.DoesNotExist:
            return error_response(message="Owner not found", status_code=404)
