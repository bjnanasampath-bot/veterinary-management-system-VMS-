from rest_framework import generics, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import Owner
from .serializers import OwnerSerializer, OwnerListSerializer


class OwnerListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['first_name', 'created_at']

    def get_queryset(self):
        qs = Owner.objects.filter(is_active=True)
        if self.request.user.role == 'client':
            return qs.filter(user=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OwnerListSerializer
        return OwnerSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = OwnerSerializer(data=request.data)
        if serializer.is_valid():
            owner = serializer.save()
            return success_response(data=OwnerSerializer(owner).data, message="Owner created", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)


class OwnerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OwnerSerializer

    def get_queryset(self):
        qs = Owner.objects.filter(is_active=True)
        if self.request.user.role == 'client':
            return qs.filter(user=self.request.user)
        return qs

    def destroy(self, request, *args, **kwargs):
        owner = self.get_object()
        owner.is_active = False
        owner.save()
        return success_response(message="Owner deleted")


class OwnerPetsView(APIView):
    def get(self, request, pk):
        try:
            qs = Owner.objects.filter(is_active=True)
            if request.user.role == 'client':
                qs = qs.filter(user=request.user)
            owner = qs.get(pk=pk)
            
            from apps.pets.serializers import PetSerializer
            pets = owner.pets.filter(is_active=True)
            return success_response(data=PetSerializer(pets, many=True).data)
        except Owner.DoesNotExist:
            return error_response(message="Owner not found", status_code=404)
