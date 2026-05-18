from rest_framework import viewsets

from .models import Recommendation
from .serializers import RecommendationSerializer


class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.select_related("homeowner").all()
    serializer_class = RecommendationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        homeowner_id = self.request.query_params.get("homeowner_id")
        if homeowner_id:
            queryset = queryset.filter(homeowner_id=homeowner_id)
        return queryset
