# User profile serializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
# UserProfileSerializer section


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile - includes readable username and email."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    pricing_plan_name = serializers.CharField(source='pricing_plan.name', read_only=True)
    # Meta section

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'address',
            'is_active_member', 'plan_name', 'pricing_plan', 'pricing_plan_name',
            'plan_expiry_date', 'date_joined'
        ]
