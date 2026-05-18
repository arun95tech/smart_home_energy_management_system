from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, change_password, login_view, register_homeowner

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)

urlpatterns = [
    path('login/', login_view),
    path('register-homeowner/', register_homeowner),
    path('change-password/', change_password),
    path('', include(router.urls)),
]
