from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.responses import success_response, error_response
from .models import PharmacyItem, Prescription
from .serializers import PharmacyItemSerializer, PrescriptionSerializer
from django.db.models import Count, Sum
from django.utils import timezone

class PharmacyItemListCreateView(generics.ListCreateAPIView):
    queryset = PharmacyItem.objects.filter(is_active=True)
    serializer_class = PharmacyItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'stock_quantity']

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return success_response(data=PharmacyItemSerializer(item).data, status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)

class PharmacyItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PharmacyItem.objects.filter(is_active=True)
    serializer_class = PharmacyItemSerializer

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        item = self.get_object()
        item.is_active = False
        item.save()
        return success_response(message="Item removed")


class PrescriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'pet', 'doctor']
    search_fields = ['pet__name', 'medication_name']
    ordering_fields = ['created_at']

    def get_queryset(self):
        qs = Prescription.objects.filter(is_active=True)
        if self.request.user.role == 'doctor':
            qs = qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none() # Restricted to admin and doctors
        return qs

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            presc = serializer.save()
            return success_response(data=PrescriptionSerializer(presc).data, status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors)

class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        qs = Prescription.objects.filter(is_active=True)
        if self.request.user.role == 'doctor':
            qs = qs.filter(doctor__user=self.request.user)
        elif self.request.user.role not in ['admin']:
            return qs.none()
        return qs

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'doctor']:
            return error_response(message="Not authorized", status_code=403)
        presc = self.get_object()
        presc.is_active = False
        presc.save()
        return success_response(message="Prescription removed")

class PharmacyAnalyticsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        today = now.date()
        
        # Overall Stock Stats
        total_items = PharmacyItem.objects.filter(is_active=True).count()
        low_stock = PharmacyItem.objects.filter(is_active=True, stock_quantity__gt=0, stock_quantity__lt=10).count()
        out_of_stock = PharmacyItem.objects.filter(is_active=True, stock_quantity=0).count()
        expired_soon = PharmacyItem.objects.filter(is_active=True, expiry_date__lte=today + timezone.timedelta(days=30)).count()

        # Activity summary
        prescriptions_today = Prescription.objects.filter(is_active=True, created_at__date=today).count()
        
        return success_response(data={
            'total_items': total_items,
            'low_stock': low_stock,
            'out_of_stock': out_of_stock,
            'expired_soon': expired_soon,
            'prescriptions_today': prescriptions_today
        })
