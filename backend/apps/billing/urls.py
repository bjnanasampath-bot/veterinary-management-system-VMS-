from django.urls import path
from .views import BillListCreateView, BillDetailView, BillPaymentView, BillSendEmailView

urlpatterns = [
    path('', BillListCreateView.as_view(), name='bill-list-create'),
    path('<uuid:pk>/', BillDetailView.as_view(), name='bill-detail'),
    path('<uuid:pk>/payment/', BillPaymentView.as_view(), name='bill-payment'),
    path('<uuid:pk>/send-email/', BillSendEmailView.as_view(), name='bill-send-email'),
]
