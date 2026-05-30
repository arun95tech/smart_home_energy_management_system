# Notification data model
from django.db import models
from django.contrib.auth.models import User
# Notification section


class Notification(models.Model):
    TYPE_CHOICES = [
        ('high_usage', 'High Usage'),
        ('fault', 'Fault Alert'),
        ('recommendation', 'Recommendation'),
        ('schedule', 'Schedule'),
    ]

    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications'
    )
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='recommendation')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    # mark_as_read function

    def mark_as_read(self):
        self.is_read = True
        self.save()
    # Meta section

    class Meta:
        ordering = ['-created_at']
    # __str__ function

    def __str__(self):
        return f"{self.notification_type} â†’ {self.recipient.username}"
