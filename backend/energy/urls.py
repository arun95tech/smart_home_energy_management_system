from django.http import JsonResponse
from django.urls import path


def energy_home(request):
    return JsonResponse({"app": "energy", "status": "ready"})


urlpatterns = [
    path("", energy_home, name="energy_home"),
]
