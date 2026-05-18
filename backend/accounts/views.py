from rest_framework import viewsets

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """Read and update user profile records."""

    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = UserProfileSerializer
    http_method_names = ["get", "patch", "head", "options"]
