# Appliance admin setup
from django.contrib import admin
from .models import Appliance, ApplianceSchedule, FaultReport
# ApplianceAdmin section


@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ['name', 'homeowner', 'appliance_type', 'status', 'power_rating', 'room_location']
    list_filter = ['appliance_type', 'status', 'is_renewable_supported']
    search_fields = ['name', 'homeowner__username']
# ApplianceScheduleAdmin section


@admin.register(ApplianceSchedule)
class ApplianceScheduleAdmin(admin.ModelAdmin):
    list_display = ['appliance', 'start_time', 'end_time', 'repeat_daily']
# FaultReportAdmin section


@admin.register(FaultReport)
class FaultReportAdmin(admin.ModelAdmin):
    list_display = ['appliance', 'homeowner', 'status', 'reported_at', 'completed_at']
    list_filter = ['status']
