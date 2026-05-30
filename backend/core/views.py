# React app fallback view
"""
Core views - serves the React frontend for non-API routes.
"""
import os
from django.http import FileResponse, HttpResponse
from django.conf import settings
# Serve React frontend


def react_app(request):
    """Serve the React index.html for all non-API routes."""
    index_path = os.path.join(
        settings.BASE_DIR, '..', 'frontend', 'dist', 'index.html'
    )
    try:
        with open(index_path, 'r') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponse(
            """
            <html><body style="font-family:sans-serif;padding:40px;background:#1e2a3a;color:white">
            <h2>⚡ Smart Home Energy Management System</h2>
            <p>React app not built yet. Please run:</p>
            <pre style="background:#0d1b2a;padding:16px;border-radius:8px">
cd frontend
npm install
npm run build
            </pre>
            <p>Then refresh this page.</p>
            <hr/>
            <p>API is running: <a href="/api/appliances/" style="color:#4ade80">/api/appliances/</a></p>
            </body></html>
            """,
            content_type='text/html',
            status=200
        )
