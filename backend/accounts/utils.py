# Simple authentication helper functions
from django.contrib.auth.models import AnonymousUser, User
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner


AUTH_TOKEN_SALT = 'shems-auth-token'
AUTH_TOKEN_MAX_AGE = 60 * 60 * 24
# Create simple auth token


def create_auth_token(user):
    return TimestampSigner(salt=AUTH_TOKEN_SALT).sign(str(user.id))
# Read bearer token from request


def _get_bearer_token(request):
    header = request.headers.get('Authorization', '')
    if header.startswith('Bearer '):
        return header.split(' ', 1)[1].strip()
    return None
# Get logged in user from token


def get_request_user(request):
    token = _get_bearer_token(request)
    if not token:
        return AnonymousUser()

    try:
        user_id = TimestampSigner(salt=AUTH_TOKEN_SALT).unsign(
            token,
            max_age=AUTH_TOKEN_MAX_AGE,
        )
        return User.objects.get(id=user_id)
    except (BadSignature, SignatureExpired, User.DoesNotExist, ValueError, TypeError):
        return AnonymousUser()

    return AnonymousUser()
# Get logged in user role


def get_request_role(request):
    user = get_request_user(request)
    if getattr(user, 'is_authenticated', False) and hasattr(user, 'profile'):
        return user.profile.role
    return None
# Admin role check


def is_admin(request):
    return get_request_role(request) == 'admin'
# Homeowner role check


def is_homeowner(request):
    return get_request_role(request) == 'homeowner'
# Technician role check


def is_technician(request):
    return get_request_role(request) == 'technician'
