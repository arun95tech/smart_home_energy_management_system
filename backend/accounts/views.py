from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer
from .utils import create_auth_token, get_request_user, is_admin


class UserProfileViewSet(viewsets.ModelViewSet):
    """CRUD for user profiles. Supports PATCH for activation/plan updates."""
    queryset = UserProfile.objects.select_related('user').all()
    serializer_class = UserProfileSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        qs = super().get_queryset()
        if is_admin(self.request):
            return qs
        user = get_request_user(self.request)
        if getattr(user, 'is_authenticated', False):
            return qs.filter(user=user)
        return qs.none()

    def partial_update(self, request, *args, **kwargs):
        profile = self.get_object()
        user = get_request_user(request)
        if not is_admin(request) and profile.user_id != getattr(user, 'id', None):
            return Response({'detail': 'You can update only your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User profile not found.'}, status=status.HTTP_400_BAD_REQUEST)

    if role and profile.role != role:
        return Response({'detail': f'This account is not registered as {role}.'}, status=status.HTTP_403_FORBIDDEN)

    if not profile.is_active_member and profile.role != 'admin':
        return Response({'detail': 'This member account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': profile.role,
        'profile_id': profile.id,
        'auth_token': create_auth_token(user),
    })


@api_view(['POST'])
def register_homeowner(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    email = request.data.get('email', '').strip()

    if not username or not password:
        return Response({'detail': 'username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    profile = UserProfile.objects.create(
        user=user,
        role='homeowner',
        phone_number=request.data.get('phone_number', ''),
        address=request.data.get('address', ''),
        plan_name='Standard Plan',
        is_active_member=True,
    )

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': profile.role,
        'profile_id': profile.id,
        'auth_token': create_auth_token(user),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def change_password(request):
    user = get_request_user(request)
    if not getattr(user, 'is_authenticated', False):
        return Response({'detail': 'Login required.'}, status=status.HTTP_401_UNAUTHORIZED)

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    if not current_password or not new_password:
        return Response(
            {'detail': 'current_password and new_password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not user.check_password(current_password):
        return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({'detail': 'Password changed successfully.'})
