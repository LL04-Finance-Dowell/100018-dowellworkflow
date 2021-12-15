from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from django.core.mail import send_mail
from django.urls import reverse
from django.utils import timezone
from django.contrib.sites.models import Site
from accounts.models import CustomUser
from workflow.models import DocumentType



def user_directory_path(filename):
    # file will be uploaded to MEDIA_ROOT/<filename>
    return filename


class Template(models.Model):
    template_name   = models.CharField(max_length=100, null=False)
    document_type   = models.OneToOneField(DocumentType, on_delete=models.CASCADE, null=False)
    auth_user_list  = models.ManyToManyField(CustomUser, related_name='auth_users')
    file            = models.FileField(upload_to=user_directory_path, null=True)
    created_by      = models.ForeignKey(CustomUser, related_name='author', on_delete=models.CASCADE, null=False)

    def __str__(self):
        return f'{self.template_name} - {self.document_type}'


class EditorFile(models.Model):
    document_name   = models.CharField(max_length=100, null=False)
    document_type   = models.ForeignKey(DocumentType, on_delete=models.CASCADE, null=True)
    file_type       = models.CharField(max_length=100, null=False, default='draft')
    file            = models.FileField(upload_to=user_directory_path, null=True)
    auth_user_list  = models.ManyToManyField(CustomUser, related_name='authenticated_users', blank=False)
    created_by      = models.ForeignKey(CustomUser, related_name='created_by', on_delete=models.CASCADE, null=False)
    created_on      = models.DateTimeField(auto_now=True)

    internal_status		= models.IntegerField(default=0)
    internal_wf_step	= models.CharField(max_length=100, null=True, blank=True)
    external_status		= models.IntegerField(default=0)
    external_wf_step	= models.CharField(max_length=100, null=True, blank=True)
    update_time			= models.DateField(null=True)


    def __str__(self):
        return f'{self.document_name} - {self.created_by}'




@receiver(pre_save, sender=EditorFile)
def document_pre_save(sender, instance, *args, **kwargs):
	instance.update_time = timezone.now()


@receiver(post_save, sender=EditorFile)
def document_post_save(sender, instance, created, *args, **kwargs):
	email_to = None

	if instance.document_type :
		if instance.document_type.internal_work_flow and (instance.internal_wf_step != 'complete'):

			for step in instance.document_type.internal_work_flow.steps.all():
				if step.name == instance.internal_wf_step:
					if step.authority.email :
						email_to = step.authority.email

		elif instance.document_type.external_work_flow and (instance.external_wf_step != 'complete'):

			for step in instance.document_type.external_work_flow.steps.all():
				if step.name == instance.external_wf_step:
					if step.authority.email :
						email_to = step.authority.email

	if email_to :
		route = reverse('editor:verify-document', kwargs={"id": instance.id})
		link = Site.objects.get_current().domain + route

		send_mail(
			'Sign Document at DocEdit',
			'You got document to sign on DocEdit. Go at '+ link + ' to sign it ',
			'',
			[email_to,],
			fail_silently=False,
		)

