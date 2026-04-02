from django.urls import path
from .views import BillListCreateView, BillDetailView, BillPaymentView

urlpatterns = [
    path('', BillListCreateView.as_view(), name='bill-list-create'),
    path('<uuid:pk>/', BillDetailView.as_view(), name='bill-detail'),
    path('<uuid:pk>/payment/', BillPaymentView.as_view(), name='bill-payment'),
]
