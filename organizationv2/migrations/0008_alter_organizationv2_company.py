# Generated by Django 3.2.7 on 2022-02-21 15:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organizationv2', '0007_alter_company_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organizationv2',
            name='company',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='company_organization', to='organizationv2.company'),
        ),
    ]
