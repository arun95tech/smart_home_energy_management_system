# Demo credential setup command
from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
# Management command


class Command(BaseCommand):
    help = 'Creates the role credentials described in the project document.'

    HOMEOWNERS = [
        ('Arun', 'arun@123', 'arun@example.com'),
        ('priya', 'priya@123', 'priya@example.com'),
        ('rohan', 'rohan@123', 'rohan@example.com'),
        ('neha', 'neha@123', 'neha@example.com'),
        ('vikram', 'vikram@123', 'vikram@example.com'),
        ('sara', 'sara@123', 'sara@example.com'),
    ]
    # handle function

    def handle(self, *args, **options):
        from accounts.models import UserProfile
        from pricing.models import PricingPlan

        standard, _ = PricingPlan.objects.get_or_create(
            name='Standard Flat Rate',
            defaults={'plan_type': 'flat', 'rate_per_kwh': 0.30, 'discount_percentage': 0, 'is_active': True},
        )
        PricingPlan.objects.get_or_create(
            name='Peak Hour Plan',
            defaults={'plan_type': 'peak', 'rate_per_kwh': 0.35, 'discount_percentage': 5, 'is_active': True},
        )
        PricingPlan.objects.get_or_create(
            name='Green Energy Discount',
            defaults={'plan_type': 'green', 'rate_per_kwh': 0.28, 'discount_percentage': 15, 'is_active': True},
        )

        for username, password, email in self.HOMEOWNERS:
            user, _ = User.objects.get_or_create(username=username, defaults={'email': email})
            user.set_password(password)
            user.email = email
            user.save()
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = 'homeowner'
            profile.is_active_member = True
            profile.plan_name = 'Standard Plan'
            profile.pricing_plan = standard
            profile.plan_expiry_date = date.today() + timedelta(days=180)
            profile.save()

        admin, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com', 'is_staff': True})
        admin.set_password('admin@123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        admin_profile, _ = UserProfile.objects.get_or_create(user=admin)
        admin_profile.role = 'admin'
        admin_profile.is_active_member = True
        admin_profile.plan_name = 'Enterprise Plan'
        admin_profile.pricing_plan = standard
        admin_profile.save()

        technician, _ = User.objects.get_or_create(username='technician', defaults={'email': 'technician@example.com'})
        technician.set_password('tech@123')
        technician.save()
        tech_profile, _ = UserProfile.objects.get_or_create(user=technician)
        tech_profile.role = 'technician'
        tech_profile.is_active_member = True
        tech_profile.plan_name = 'Technician Plan'
        tech_profile.save()

        self.stdout.write(self.style.SUCCESS('Real credentials are ready.'))
