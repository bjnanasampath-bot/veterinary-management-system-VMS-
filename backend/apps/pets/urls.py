from django.urls import path
from .views import PetListCreateView, PetDetailView, PetMedicalHistoryView

urlpatterns = [
    path('', PetListCreateView.as_view(), name='pet-list-create'),
    path('<uuid:pk>/', PetDetailView.as_view(), name='pet-detail'),
    path('<uuid:pk>/medical-history/', PetMedicalHistoryView.as_view(), name='pet-medical-history'),
]
