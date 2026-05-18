from rest_framework import serializers

from .models import Recommendation


class RecommendationSerializer(serializers.ModelSerializer):
    homeowner_username = serializers.CharField(source="homeowner.username", read_only=True)

    class Meta:
        model = Recommendation
        fields = [
            "id",
            "homeowner",
            "homeowner_username",
            "title",
            "description",
            "estimated_saving",
            "created_at",
        ]
