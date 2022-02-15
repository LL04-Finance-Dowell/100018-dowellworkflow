from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView,UpdateView
from django.urls import reverse_lazy
from .forms import DocumentForm
from .models import Document

class DocumentListView(ListView):

	model = Document
	template_name = 'home.html'

class DocumentDetailView(DetailView):

	model = Document
	template_name = 'doc_detail.html'
	


class DocumentCreateView(CreateView):

	form_class = DocumentForm
	template_name = 'doc_new.html'

	def get_success_url(self):
		return reverse_lazy('doc_detail',args= [str(self.object.id)])

	
# class DocumentUpdateView(UpdateView):
# 	form_class = DocumentForm
# 	template_name = 'doc_edit.html'

	
