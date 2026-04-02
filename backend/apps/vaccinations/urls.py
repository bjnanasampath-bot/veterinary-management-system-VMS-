from django.urls import path
from .views import VaccinationListCreateView, VaccinationDetailView, OverdueVaccinationsView, UpcomingVaccinationsView

urlpatterns = [
    path('', VaccinationListCreateView.as_view(), name='vaccination-list-create'),
    path('overdue/', OverdueVaccinationsView.as_view(), name='overdue-vaccinations'),
    path('upcoming/', UpcomingVaccinationsView.as_view(), name='upcoming-vaccinations'),
    path('<uuid:pk>/', VaccinationDetailView.as_view(), name='vaccination-detail'),
]
