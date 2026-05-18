from django.http import JsonResponse
from django.urls import path


def notifications_home(request):
    return JsonResponse({"app": "notifications", "status": "ready"})


urlpatterns = [
    path("", notifications_home, name="notifications_home"),
]
