from django.http import JsonResponse
from django.urls import path


def accounts_home(request):
    return JsonResponse({"app": "accounts", "status": "ready"})


urlpatterns = [
    path("", accounts_home, name="accounts_home"),
]
