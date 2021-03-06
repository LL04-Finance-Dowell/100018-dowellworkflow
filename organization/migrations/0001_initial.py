# Generated by Django 3.2.7 on 2021-12-20 09:09

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('workflow', '0002_document_created_by'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('editor', '0009_template_created_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('organization_name', models.CharField(max_length=100)),
                ('members', models.ManyToManyField(related_name='members', to=settings.AUTH_USER_MODEL)),
                ('staff_members', models.ManyToManyField(related_name='staff_members', to=settings.AUTH_USER_MODEL)),
                ('templates', models.ManyToManyField(to='editor.Template')),
                ('workflows', models.ManyToManyField(to='workflow.DocumentType')),
            ],
        ),
    ]
