from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from django.core.mail import send_mail
from django.db import models
from django.urls import reverse
from django.utils import timezone
from accounts.models import CustomUser
from django.contrib.sites.models import Site


# Create your models here.

class SigningStep(models.Model):
	name 		= models.CharField(max_length=100)
	authority	= models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=False)

	def __str__(self):
		return f'{self.name} - {self.authority}'


class WorkFlowModel(models.Model):
	title       = models.CharField(max_length=100)
	steps		= models.ManyToManyField(SigningStep, blank=True)

	class Meta:
		ordering = ['title']

	def __str__(self):
		return f'{self.title}'


class DocumentType(models.Model):
	title       			= models.CharField(max_length=100)
	internal_work_flow 		= models.ForeignKey(WorkFlowModel, related_name='%(class)s_internal_wf', on_delete=models.SET_NULL, null=True, blank=True)
	external_work_flow 		= models.ForeignKey(WorkFlowModel, related_name='%(class)s_external_wf', on_delete=models.SET_NULL, null=True, blank=True)


	def get_absolute_url(self):
		return reverse("workflow:detail-document-type", kwargs={"id": self.id})

	def __str__(self):
		return self.title

class Document(models.Model):
	document_name 		= models.CharField(max_length=100, null=False)
	document_type 		= models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True)
	internal_status		= models.IntegerField(default=0)
	internal_wf_step	= models.CharField(max_length=100, null=True, blank=True)
	external_status		= models.IntegerField(default=0)
	external_wf_step	= models.CharField(max_length=100, null=True, blank=True)
	update_time			= models.DateField(null=True)
	notify_users 		= models.BooleanField(default=True)
	created_by 			= models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, default=1)



	def __str__(self):
		return self.document_name



@receiver(pre_save, sender=Document)
def document_pre_save(sender, instance, *args, **kwargs):
	instance.update_time = timezone.now()


@receiver(post_save, sender=Document)
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
		route = reverse('workflow:verify-document', kwargs={"id": instance.id})
		link = Site.objects.get_current().domain + route

		send_mail(
			'Sign Document at DocEdit',
			'You got document to sign on DocEdit. Go at '+ link + ' to sign it ',
			'',
			[email_to,],
			fail_silently=False,
		)



