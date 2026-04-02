from django.urls import path
from .views import DashboardStatsView, RevenueReportView, AppointmentReportView, PetSpeciesReportView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('revenue/', RevenueReportView.as_view(), name='revenue-report'),
    path('appointments/', AppointmentReportView.as_view(), name='appointment-report'),
    path('pets/species/', PetSpeciesReportView.as_view(), name='pet-species-report'),
]
