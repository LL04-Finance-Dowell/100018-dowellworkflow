# Generated by Django 3.2.3 on 2022-02-08 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organizationv2', '0002_organizationv2_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='organizations',
            field=models.ManyToManyField(related_name='company_orgs', to='organizationv2.Organizationv2'),
        ),
    ]
