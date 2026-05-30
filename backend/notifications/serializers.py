# Notification serializer
from rest_framework import serializers
from .models import Notification
# NotificationSerializer section


class NotificationSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    # Meta section

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'recipient_username', 'notification_type', 'message', 'is_read', 'created_at']
