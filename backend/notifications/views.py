from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from accounts.utils import get_request_user, is_admin, is_homeowner
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related('recipient').all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        recipient_id = self.request.query_params.get('recipient_id')
        if recipient_id:
            qs = qs.filter(recipient_id=recipient_id)
        if is_homeowner(self.request):
            qs = qs.filter(recipient=get_request_user(self.request))
        return qs

    def destroy(self, request, *args, **kwargs):
        if is_admin(request):
            return Response({'detail': 'Admins cannot delete notifications.'}, status=status.HTTP_403_FORBIDDEN)
        notification = self.get_object()
        user = get_request_user(request)
        if is_homeowner(request) and notification.recipient_id != getattr(user, 'id', None):
            return Response({'detail': 'You can delete only your own notifications.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.mark_as_read()
        return Response(self.get_serializer(notif).data)
