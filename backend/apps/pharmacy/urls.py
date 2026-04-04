from django.urls import path
from . import views

urlpatterns = [
    # Pharmacy Inventory Items
    path('items/', views.PharmacyItemListCreateView.as_view(), name='pharmacy-item-list-create'),
    path('items/<uuid:pk>/', views.PharmacyItemDetailView.as_view(), name='pharmacy-item-detail'),
    
    # Prescriptions
    path('prescriptions/', views.PrescriptionListCreateView.as_view(), name='prescription-list-create'),
    path('prescriptions/<uuid:pk>/', views.PrescriptionDetailView.as_view(), name='prescription-detail'),
]
