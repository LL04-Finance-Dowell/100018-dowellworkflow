# Generated by Django 3.2.7 on 2021-11-29 08:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0002_document_created_by'),
        ('editor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='editorfile',
            name='document_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='workflow.documenttype'),
        ),
    ]
