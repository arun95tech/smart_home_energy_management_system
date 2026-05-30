# Notification APIs
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from accounts.utils import get_request_user, is_admin, is_homeowner, is_technician
from .models import Notification
from .serializers import NotificationSerializer
# Notification management API


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related('recipient').all()
    serializer_class = NotificationSerializer
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        recipient_id = self.request.query_params.get('recipient_id')
        user = get_request_user(self.request)
        if is_admin(self.request):
            if recipient_id:
                qs = qs.filter(recipient_id=recipient_id)
            return qs
        if is_homeowner(self.request) or is_technician(self.request):
            return qs.filter(recipient=user)
        return qs.none()
    # destroy function

    def destroy(self, request, *args, **kwargs):
        if is_admin(request):
            return Response({'detail': 'Admins cannot delete notifications.'}, status=status.HTTP_403_FORBIDDEN)
        notification = self.get_object()
        user = get_request_user(request)
        if is_homeowner(request) and notification.recipient_id != getattr(user, 'id', None):
            return Response({'detail': 'You can delete only your own notifications.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    # mark_read function

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        user = get_request_user(request)
        if not is_admin(request) and notif.recipient_id != getattr(user, 'id', None):
            return Response({'detail': 'You can mark only your own notifications as read.'}, status=status.HTTP_403_FORBIDDEN)
        notif.mark_as_read()
        return Response(self.get_serializer(notif).data)
