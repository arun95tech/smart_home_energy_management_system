# Notification admin setup
from django.contrib import admin
from .models import Notification
# NotificationAdmin section

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read']
