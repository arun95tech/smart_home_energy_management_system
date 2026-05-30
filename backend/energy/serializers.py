# Energy usage serializers
from rest_framework import serializers
from .models import DailyBill, EnergyUsage, EnergyUsageSession
# EnergyUsageSerializer section


class EnergyUsageSerializer(serializers.ModelSerializer):
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    homeowner_username = serializers.CharField(source='appliance.homeowner.username', read_only=True)
    homeowner_id = serializers.IntegerField(source='appliance.homeowner.id', read_only=True)
    # Meta section

    class Meta:
        model = EnergyUsage
        fields = [
            'id', 'appliance', 'appliance_name', 'homeowner_username', 'homeowner_id',
            'usage_kwh', 'usage_date', 'usage_time', 'recorded_at'
        ]
# EnergyUsageSessionSerializer section


class EnergyUsageSessionSerializer(serializers.ModelSerializer):
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    homeowner_username = serializers.CharField(source='homeowner.username', read_only=True)
    # Meta section

    class Meta:
        model = EnergyUsageSession
        fields = [
            'id', 'appliance', 'appliance_name', 'homeowner', 'homeowner_username',
            'started_at', 'ended_at', 'duration_minutes', 'usage_kwh',
            'estimated_cost', 'created_at'
        ]
# DailyBillSerializer section


class DailyBillSerializer(serializers.ModelSerializer):
    homeowner_username = serializers.CharField(source='homeowner.username', read_only=True)
    # Meta section

    class Meta:
        model = DailyBill
        fields = [
            'id', 'homeowner', 'homeowner_username', 'bill_date',
            'total_kwh', 'total_cost', 'updated_at'
        ]
