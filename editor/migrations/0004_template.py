# Generated by Django 3.2.7 on 2021-12-06 06:51

from django.db import migrations, models
import django.db.models.deletion
import editor.models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0002_document_created_by'),
        ('editor', '0003_auto_20211201_0601'),
    ]

    operations = [
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('template_name', models.CharField(max_length=100)),
                ('file', models.FileField(null=True, upload_to=editor.models.user_directory_path)),
                ('document_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='workflow.documenttype')),
            ],
        ),
    ]
