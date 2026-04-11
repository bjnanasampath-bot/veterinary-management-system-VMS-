from rest_framework import generics, status, permissions
from common.responses import success_response, error_response
from .models import SystemSetting
from .serializers import SystemSettingSerializer

class SystemSettingListView(generics.ListAPIView):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

class SystemSettingUpdateView(generics.UpdateAPIView):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'key'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, message=f"Setting '{instance.key}' updated")
        return error_response(errors=serializer.errors)
