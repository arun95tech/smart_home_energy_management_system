from django.contrib.auth.models import AnonymousUser, User


def get_request_user(request):
    user_id = request.headers.get('X-User-Id')
    username = request.headers.get('X-Username')

    if user_id:
        try:
            return User.objects.get(id=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return AnonymousUser()

    if username:
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return AnonymousUser()

    return AnonymousUser()


def get_request_role(request):
    role = request.headers.get('X-Role')
    if role:
        return role
    user = get_request_user(request)
    if getattr(user, 'is_authenticated', False) and hasattr(user, 'profile'):
        return user.profile.role
    return None


def is_admin(request):
    return get_request_role(request) == 'admin'


def is_homeowner(request):
    return get_request_role(request) == 'homeowner'


def is_technician(request):
    return get_request_role(request) == 'technician'
