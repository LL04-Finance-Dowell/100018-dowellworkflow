# Generated by Django 3.2.7 on 2022-03-21 08:29

from django.db import migrations, models
import organizationv2.models


class Migration(migrations.Migration):

    dependencies = [
        ('organizationv2', '0010_auto_20220321_0813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='uploaded_company_logo',
            field=models.FileField(null=True, upload_to=organizationv2.models.company_logo_path),
        ),
    ]
