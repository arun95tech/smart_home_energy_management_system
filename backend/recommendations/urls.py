from django.http import JsonResponse
from django.urls import path


def recommendations_home(request):
    return JsonResponse({"app": "recommendations", "status": "ready"})


urlpatterns = [
    path("", recommendations_home, name="recommendations_home"),
]
