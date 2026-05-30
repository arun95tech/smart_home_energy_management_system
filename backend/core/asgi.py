# Django ASGI entry point
"""ASGI config for the Smart Home Energy Management System."""
import os

from django.core.asgi import get_asgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

application = get_asgi_application()
