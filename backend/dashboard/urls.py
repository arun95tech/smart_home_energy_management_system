from django.urls import path
from .views import dashboard_summary, admin_dashboard_summary

urlpatterns = [
    path('dashboard-summary/<int:homeowner_id>/', dashboard_summary, name='dashboard-summary'),
    path('admin-dashboard-summary/', admin_dashboard_summary, name='admin-dashboard-summary'),
]
