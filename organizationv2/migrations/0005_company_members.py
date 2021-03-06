# Generated by Django 3.2.3 on 2022-02-10 14:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organizationv2', '0004_organizationv2_projects'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='members',
            field=models.ManyToManyField(related_name='company_members', to=settings.AUTH_USER_MODEL),
        ),
    ]
