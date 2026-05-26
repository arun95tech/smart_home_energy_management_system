from rest_framework import viewsets, status
from rest_framework.response import Response
from accounts.utils import get_request_user, is_admin, is_homeowner
from .models import Recommendation
from .serializers import RecommendationSerializer


class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.select_related('homeowner').all()
    serializer_class = RecommendationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        if is_homeowner(self.request):
            return qs.filter(homeowner=get_request_user(self.request))
        if is_admin(self.request):
            if homeowner_id:
                qs = qs.filter(homeowner_id=homeowner_id)
            return qs
        return qs.none()

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can create recommendations.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['homeowner'] = get_request_user(request).id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        recommendation = self.get_object()
        if not is_homeowner(request) or recommendation.homeowner_id != get_request_user(request).id:
            return Response({'detail': 'You can delete only your own recommendations.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
