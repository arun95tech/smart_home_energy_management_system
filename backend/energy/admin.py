# Energy admin setup
from django.contrib import admin
from .models import EnergyUsage
# EnergyUsageAdmin section

@admin.register(EnergyUsage)
class EnergyUsageAdmin(admin.ModelAdmin):
    list_display = ['appliance', 'usage_kwh', 'usage_date', 'usage_time']
    list_filter = ['usage_date']
