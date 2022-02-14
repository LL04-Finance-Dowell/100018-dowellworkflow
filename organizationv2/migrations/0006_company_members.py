# Generated by Django 4.0.2 on 2022-02-13 19:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organizationv2', '0005_rename_org_id_verificationtoken_company_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='members',
            field=models.ManyToManyField(related_name='company_members', to=settings.AUTH_USER_MODEL),
        ),
    ]