from django.db import models
from accounts.models import CustomUser
from django.urls import reverse

class Document(models.Model):
	user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='document',null=True)
	title = models.CharField(max_length=200)
	content = models.TextField()
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title

	# def get_absolute_url(self): 
	# 	return reverse('doc_detail',  args=[str(self.id)])



