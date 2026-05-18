# Generated for the Smart Home Energy Management System.

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PricingPlan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "plan_type",
                    models.CharField(
                        choices=[
                            ("flat", "Flat Rate"),
                            ("peak", "Peak Hour"),
                            ("green", "Green Energy"),
                        ],
                        default="flat",
                        max_length=20,
                    ),
                ),
                ("rate_per_kwh", models.FloatField()),
                ("discount_percentage", models.FloatField(default=0)),
                ("is_active", models.BooleanField(default=True)),
            ],
        ),
    ]
