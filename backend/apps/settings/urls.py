from django.urls import path
from .views import SystemSettingListView, SystemSettingUpdateView

urlpatterns = [
    path('', SystemSettingListView.as_view(), name='settings-list'),
    path('<str:key>/', SystemSettingUpdateView.as_view(), name='settings-update'),
]
