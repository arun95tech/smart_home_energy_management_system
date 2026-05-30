# Accounts admin setup
from django.contrib import admin
from .models import UserProfile
# UserProfileAdmin section


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'plan_name', 'is_active_member', 'plan_expiry_date']
    list_filter = ['role', 'is_active_member']
    search_fields = ['user__username', 'user__email']
