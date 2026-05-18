from django.contrib import admin
from django.conf import settings
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.static import serve

from core.views import react_app


def health_check(request):
    return JsonResponse({"status": "ok", "message": "Backend is running"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health_check"),
    path("api/accounts/", include("accounts.urls")),
    path("api/appliances/", include("appliances.urls")),
    path("api/energy/", include("energy.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/recommendations/", include("recommendations.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/pricing/", include("pricing.urls")),
    re_path(
        r"^assets/(?P<path>.*)$",
        serve,
        {"document_root": settings.BASE_DIR.parent / "frontend" / "dist" / "assets"},
    ),
    re_path(r"^(?!api/)(?!admin/).*$", react_app, name="react_app"),
]
