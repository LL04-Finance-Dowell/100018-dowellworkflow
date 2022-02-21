# Generated by Django 3.2.3 on 2022-02-15 08:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organizationv2', '0006_auto_20220210_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='admin',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='company_admin', to=settings.AUTH_USER_MODEL),
        ),
    ]