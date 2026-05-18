from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related("recipient").all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        recipient_id = self.request.query_params.get("recipient_id")
        if recipient_id:
            queryset = queryset.filter(recipient_id=recipient_id)
        return queryset

    @action(detail=True, methods=["patch"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.mark_as_read()
        return Response(self.get_serializer(notification).data)
