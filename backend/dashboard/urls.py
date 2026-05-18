from django.http import JsonResponse
from django.urls import path


def dashboard_home(request):
    return JsonResponse({"app": "dashboard", "status": "ready"})


urlpatterns = [
    path("", dashboard_home, name="dashboard_home"),
]
