from pathlib import Path

from django.conf import settings
from django.http import HttpResponse


def react_app(request):
    """Serve the built React app for all non-API routes."""
    index_path = Path(settings.BASE_DIR).parent / "frontend" / "dist" / "index.html"

    try:
        return HttpResponse(index_path.read_text(), content_type="text/html")
    except FileNotFoundError:
        return HttpResponse(
            """
            <html>
              <body style="font-family:sans-serif;padding:40px">
                <h2>Smart Home Energy Management System</h2>
                <p>Frontend build not found. Please run:</p>
                <pre>cd frontend
npm install
npm run build</pre>
                <p>Then run the backend server again.</p>
              </body>
            </html>
            """,
            content_type="text/html",
            status=200,
        )
