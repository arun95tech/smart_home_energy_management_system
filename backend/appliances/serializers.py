# Appliance serializers
from rest_framework import serializers
from .models import Appliance, ApplianceSchedule, FaultReport
# ApplianceSerializer section


class ApplianceSerializer(serializers.ModelSerializer):
    """Appliance serializer - includes readable homeowner username."""
    homeowner_username = serializers.CharField(source='homeowner.username', read_only=True)
    # Meta section

    class Meta:
        model = Appliance
        fields = [
            'id', 'homeowner', 'homeowner_username', 'name', 'appliance_type',
            'power_rating', 'status', 'room_location', 'is_renewable_supported',
            'last_turned_on_at', 'created_at'
        ]
# ApplianceScheduleSerializer section


class ApplianceScheduleSerializer(serializers.ModelSerializer):
    # Meta section
    class Meta:
        model = ApplianceSchedule
        fields = '__all__'
# FaultReportSerializer section


class FaultReportSerializer(serializers.ModelSerializer):
    """FaultReport serializer with full appliance and homeowner details."""
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    appliance_type = serializers.CharField(source='appliance.appliance_type', read_only=True)
    room_location = serializers.CharField(source='appliance.room_location', read_only=True)
    power_rating = serializers.FloatField(source='appliance.power_rating', read_only=True)
    appliance_status = serializers.CharField(source='appliance.status', read_only=True)
    homeowner_username = serializers.CharField(source='homeowner.username', read_only=True)
    # Meta section

    class Meta:
        model = FaultReport
        fields = [
            'id', 'appliance', 'appliance_name', 'appliance_type',
            'room_location', 'power_rating', 'appliance_status',
            'homeowner', 'homeowner_username',
            'message', 'status', 'reported_at', 'completed_at'
        ]
