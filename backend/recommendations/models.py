from django.db import models
from django.contrib.auth.models import User


class Recommendation(models.Model):
    homeowner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    title = models.CharField(max_length=200)
    description = models.TextField()
    estimated_saving = models.FloatField(default=0.0, help_text='Estimated saving in GBP per month')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} → {self.homeowner.username}"
