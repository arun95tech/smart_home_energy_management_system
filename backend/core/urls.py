"""
URL configuration for Smart Home Energy Management System.
API routes under /api/, Django admin at /admin/, React catches everything else.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
import os
from core.views import react_app

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # All API routes
    path('api/', include('accounts.urls')),
    path('api/', include('appliances.urls')),
    path('api/', include('energy.urls')),
    path('api/', include('pricing.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('recommendations.urls')),
    path('api/', include('dashboard.urls')),

    # Serve React assets from the dist/assets folder
    re_path(
        r'^assets/(?P<path>.*)$',
        serve,
        {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist', 'assets')}
    ),

    # Catch-all: serve React app for any non-API route
    # This allows browser refresh on React routes to work
    re_path(r'^(?!api/)(?!admin/).*$', react_app),
]
