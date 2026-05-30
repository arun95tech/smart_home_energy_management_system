# User profile model
"""
Accounts app - UserProfile model extending Django's built-in User.
Adds role, contact info, and membership plan details.
"""
from django.db import models
from django.contrib.auth.models import User
# UserProfile section


class UserProfile(models.Model):
    """Extended profile for each user with role and plan info."""

    ROLE_CHOICES = [
        ('homeowner', 'Homeowner'),
        ('admin', 'Admin'),
        ('technician', 'Technician'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='homeowner')
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active_member = models.BooleanField(default=True)
    plan_name = models.CharField(max_length=100, default='Standard Plan')
    pricing_plan = models.ForeignKey(
        'pricing.PricingPlan', on_delete=models.SET_NULL, null=True, blank=True
    )
    plan_expiry_date = models.DateField(null=True, blank=True)
    # activate_member function

    def activate_member(self):
        """Activate this user's membership."""
        self.is_active_member = True
        self.save()
    # deactivate_member function

    def deactivate_member(self):
        """Deactivate this user's membership."""
        self.is_active_member = False
        self.save()
    # __str__ function

    def __str__(self):
        return f"{self.user.username} ({self.role})"
