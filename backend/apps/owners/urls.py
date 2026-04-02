from django.urls import path
from .views import OwnerListCreateView, OwnerDetailView, OwnerPetsView

urlpatterns = [
    path('', OwnerListCreateView.as_view(), name='owner-list-create'),
    path('<uuid:pk>/', OwnerDetailView.as_view(), name='owner-detail'),
    path('<uuid:pk>/pets/', OwnerPetsView.as_view(), name='owner-pets'),
]
