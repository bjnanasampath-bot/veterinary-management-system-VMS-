from django.urls import path
from .views import AppointmentListCreateView, AppointmentDetailView, AppointmentStatusUpdateView, TodayAppointmentsView

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('today/', TodayAppointmentsView.as_view(), name='today-appointments'),
    path('<uuid:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<uuid:pk>/status/', AppointmentStatusUpdateView.as_view(), name='appointment-status'),
]
