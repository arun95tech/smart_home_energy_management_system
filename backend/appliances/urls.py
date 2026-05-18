from django.http import JsonResponse
from django.urls import path


def appliances_home(request):
    return JsonResponse({"app": "appliances", "status": "ready"})


urlpatterns = [
    path("", appliances_home, name="appliances_home"),
]
