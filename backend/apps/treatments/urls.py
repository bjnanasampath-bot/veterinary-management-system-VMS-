from django.urls import path
from . import views

urlpatterns = [
    path('', views.TreatmentListCreateView.as_view(), name='treatment-list-create'),
    path('<uuid:pk>/', views.TreatmentDetailView.as_view(), name='treatment-detail'),
    
    path('lab-tests/', views.LabTestListCreateView.as_view(), name='labtest-list-create'),
    path('lab-tests/<uuid:pk>/', views.LabTestDetailView.as_view(), name='labtest-detail'),
    
    path('surgeries/', views.SurgeryListCreateView.as_view(), name='surgery-list-create'),
    path('surgeries/<uuid:pk>/', views.SurgeryDetailView.as_view(), name='surgery-detail'),
]
