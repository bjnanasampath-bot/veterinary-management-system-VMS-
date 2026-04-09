from django.urls import path
from .views import DoctorListCreateView, DoctorDetailView, AttendanceView, AttendanceDetailView

urlpatterns = [
    path('', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('<uuid:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('attendance/', AttendanceView.as_view(), name='attendance-list'),
    path('attendance/<int:pk>/', AttendanceDetailView.as_view(), name='attendance-detail'),
]
