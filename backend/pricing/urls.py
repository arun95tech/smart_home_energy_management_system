from django.http import JsonResponse
from django.urls import path


def pricing_home(request):
    return JsonResponse({"app": "pricing", "status": "ready"})


urlpatterns = [
    path("", pricing_home, name="pricing_home"),
]
