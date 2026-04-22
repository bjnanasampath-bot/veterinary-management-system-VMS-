from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    created_at_human = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'link', 'created_at', 'created_at_human']
        read_only_fields = ['id', 'created_at']

    def get_created_at_human(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at).split(',')[0] + " ago"
