# Demo data seed command
"""
Management command: python manage.py seed_demo_data

Creates demo users, appliances, pricing plans, notifications,
recommendations, energy usage, and fault reports for testing.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
# Management command


class Command(BaseCommand):
    help = 'Seeds the database with demo data for testing'
    # handle function

    def handle(self, *args, **options):
        self.stdout.write('ðŸŒ± Seeding demo data...')

        # â”€â”€ Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        homeowner, _ = User.objects.get_or_create(
            username='homeowner',
            defaults={'email': 'homeowner@demo.com', 'first_name': 'Sarah', 'last_name': 'Johnson'}
        )
        homeowner.set_password('demo1234')
        homeowner.save()

        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@demo.com', 'first_name': 'Admin', 'last_name': 'User', 'is_staff': True}
        )
        admin_user.set_password('demo1234')
        admin_user.save()

        technician, _ = User.objects.get_or_create(
            username='technician',
            defaults={'email': 'tech@demo.com', 'first_name': 'Mike', 'last_name': 'Tech'}
        )
        technician.set_password('demo1234')
        technician.save()

        # â”€â”€ User Profiles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from accounts.models import UserProfile

        profile_hw, _ = UserProfile.objects.get_or_create(user=homeowner)
        profile_hw.role = 'homeowner'
        profile_hw.phone_number = '+44 7911 123456'
        profile_hw.address = '12 Green Lane, London'
        profile_hw.plan_name = 'Standard Plan'
        profile_hw.plan_expiry_date = date.today() + timedelta(days=180)
        profile_hw.is_active_member = True
        profile_hw.save()

        profile_admin, _ = UserProfile.objects.get_or_create(user=admin_user)
        profile_admin.role = 'admin'
        profile_admin.plan_name = 'Enterprise Plan'
        profile_admin.plan_expiry_date = date.today() + timedelta(days=365)
        profile_admin.save()

        profile_tech, _ = UserProfile.objects.get_or_create(user=technician)
        profile_tech.role = 'technician'
        profile_tech.plan_name = 'Technician Plan'
        profile_tech.plan_expiry_date = date.today() + timedelta(days=365)
        profile_tech.save()

        self.stdout.write('  âœ… Users + profiles created')

        # â”€â”€ Pricing Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from pricing.models import PricingPlan

        flat_plan, _ = PricingPlan.objects.get_or_create(
            name='Standard Flat Rate',
            defaults={'plan_type': 'flat', 'rate_per_kwh': 0.28, 'discount_percentage': 0, 'is_active': True}
        )
        peak_plan, _ = PricingPlan.objects.get_or_create(
            name='Peak Hour Plan',
            defaults={'plan_type': 'peak', 'rate_per_kwh': 0.35, 'discount_percentage': 5, 'is_active': True}
        )
        green_plan, _ = PricingPlan.objects.get_or_create(
            name='Green Energy Discount',
            defaults={'plan_type': 'green', 'rate_per_kwh': 0.30, 'discount_percentage': 15, 'is_active': True}
        )

        self.stdout.write('  âœ… Pricing plans created')

        # â”€â”€ Appliances â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from appliances.models import Appliance, FaultReport

        appliance_data = [
            {'name': 'Living Room AC', 'appliance_type': 'ac', 'power_rating': 1500, 'status': 'on', 'room_location': 'Living Room', 'is_renewable_supported': True},
            {'name': 'Kitchen Fridge', 'appliance_type': 'fridge', 'power_rating': 200, 'status': 'on', 'room_location': 'Kitchen', 'is_renewable_supported': False},
            {'name': 'Bedroom Heater', 'appliance_type': 'heater', 'power_rating': 2000, 'status': 'off', 'room_location': 'Bedroom', 'is_renewable_supported': False},
            {'name': 'Hall Light', 'appliance_type': 'light', 'power_rating': 60, 'status': 'on', 'room_location': 'Hallway', 'is_renewable_supported': True},
            {'name': 'Washing Machine', 'appliance_type': 'washing_machine', 'power_rating': 800, 'status': 'faulty', 'room_location': 'Utility Room', 'is_renewable_supported': False},
            {'name': 'Solar Inverter', 'appliance_type': 'other', 'power_rating': 3000, 'status': 'ok', 'room_location': 'Rooftop', 'is_renewable_supported': True},
        ]

        created_appliances = []
        for data in appliance_data:
            app, _ = Appliance.objects.get_or_create(
                homeowner=homeowner,
                name=data['name'],
                defaults=data
            )
            created_appliances.append(app)

        # Faulty appliance â†’ create FaultReport
        faulty_app = next(a for a in created_appliances if a.status == 'faulty')
        FaultReport.objects.get_or_create(
            appliance=faulty_app,
            homeowner=homeowner,
            defaults={
                'message': f"Washing machine making loud noise and not completing spin cycle.",
                'status': 'pending'
            }
        )

        self.stdout.write('  âœ… Appliances + fault report created')

        # â”€â”€ Energy Usage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from energy.models import EnergyUsage

        for appliance in created_appliances[:4]:
            EnergyUsage.objects.get_or_create(
                appliance=appliance,
                usage_date=date.today(),
                defaults={'usage_kwh': round(appliance.power_rating * 3 / 1000, 2)}
            )
            # Extra high-usage record to demo the observer
            EnergyUsage.objects.get_or_create(
                appliance=appliance,
                usage_date=date.today() - timedelta(days=1),
                defaults={'usage_kwh': round(appliance.power_rating * 8 / 1000, 2)}
            )

        self.stdout.write('  âœ… Energy usage records created')

        # â”€â”€ Recommendations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from recommendations.models import Recommendation

        rec_data = [
            {'title': 'Adjust AC Temperature', 'description': 'Set your AC to 24Â°C to save up to 10% on cooling costs.', 'estimated_saving': 12.50},
            {'title': 'Use LED Bulbs', 'description': 'Replace old bulbs with LEDs to save energy and money.', 'estimated_saving': 8.00},
            {'title': 'Run Appliances Off-Peak', 'description': 'Use heavy appliances during off-peak hours (10 PM â€“ 6 AM).', 'estimated_saving': 15.00},
            {'title': 'Unplug Standby Devices', 'description': 'Devices on standby consume up to 10% of your energy bill.', 'estimated_saving': 6.50},
        ]

        for r in rec_data:
            Recommendation.objects.get_or_create(homeowner=homeowner, title=r['title'], defaults=r)

        self.stdout.write('  âœ… Recommendations created')

        # â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        from notifications.models import Notification

        notif_data = [
            {'notification_type': 'high_usage', 'message': 'High energy usage detected! Living Room AC used 12 kWh today.', 'is_read': False},
            {'notification_type': 'fault', 'message': 'Fault Alert: Washing Machine has been marked as faulty.', 'is_read': False},
            {'notification_type': 'recommendation', 'message': 'New recommendation: Adjust your AC temperature to save money.', 'is_read': True},
            {'notification_type': 'schedule', 'message': 'Scheduled maintenance reminder for your appliances.', 'is_read': True},
        ]

        for n in notif_data:
            Notification.objects.get_or_create(recipient=homeowner, message=n['message'], defaults=n)

        # Fault notification for technician
        Notification.objects.get_or_create(
            recipient=technician,
            message='Fault Alert: Washing Machine (owned by homeowner) is faulty. Please check.',
            defaults={'notification_type': 'fault', 'is_read': False}
        )

        self.stdout.write('  âœ… Notifications created')

        self.stdout.write(self.style.SUCCESS(
            '\nðŸŽ‰ Demo data seeded successfully!\n\n'
            '  Login credentials:\n'
            '  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”\n'
            '  â”‚ Role        â”‚ Username     â”‚ Password â”‚ ID     â”‚\n'
            '  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¤\n'
            f' â”‚ Homeowner   â”‚ homeowner    â”‚ demo1234 â”‚ {homeowner.id}      â”‚\n'
            f' â”‚ Admin       â”‚ admin        â”‚ demo1234 â”‚ {admin_user.id}      â”‚\n'
            f' â”‚ Technician  â”‚ technician   â”‚ demo1234 â”‚ {technician.id}      â”‚\n'
            '  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”˜\n'
        ))
