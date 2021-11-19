from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views import View
from django.views.generic.list import ListView
import json
from .models import SigningStep, WorkFlowModel, DocumentType, Document
from .forms import DocumentForm
from accounts.models import CustomUser


# Create your views here.


def create_document_type(request, *args, **kwargs):
	try:
		body = json.loads(request.body)
	except:
		body = None

	if not body or not body['title'] :
		context = {
			'object': 'Error: Title required.'
		}
		return JsonResponse(context)


	internalWF = None
	externalWF = None

	if len(body['internal']) :
		internalWF = WorkFlowModel(title='internal')
		internalWF.save()
		for step in body['internal']:
			s = SigningStep(name=step['name'], authority= get_object_or_404(CustomUser, username=step['authority']))
			s.save()
			internalWF.steps.add(s)


	if len(body['external']) :
		externalWF = WorkFlowModel(title='external')
		externalWF.save()
		for step in body['external']:
			s = SigningStep(name=step['name'], authority= get_object_or_404(CustomUser, username=step['authority']))
			s.save()
			externalWF.steps.add(s)

	obj = DocumentType(title=body['title'], internal_work_flow=internalWF, external_work_flow=externalWF )
	obj.save()

	if obj.internal_work_flow :
	    internalWF = {
	        'title': obj.internal_work_flow.title ,
	        'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.internal_work_flow.steps.all()],
	        }

	if obj.external_work_flow :
	    externalWF = {
	        'title': obj.external_work_flow.title,
	        'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.external_work_flow.steps.all()],
	        }

	return JsonResponse({'id': obj.id, 'title': obj.title, 'internal_work_flow': internalWF, 'external_work_flow': externalWF })


def getDocumentTypeObject(request, *args, **kwargs):

    obj = get_object_or_404(DocumentType, id=kwargs['id'])
    internalWF = None
    externalWF = None

    if obj.internal_work_flow :
        internalWF = {
            'title': obj.internal_work_flow.title ,
            'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.internal_work_flow.steps.all()],
        }

    if obj.external_work_flow :
        externalWF = {
            'title': obj.external_work_flow.title,
            'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.external_work_flow.steps.all()],
        }

    return JsonResponse({
            'id': obj.id,
            'title': obj.title,
            'internal_work_flow': internalWF,
            'external_work_flow': externalWF
    })



class WorkFlowListView(ListView):
    template_name = 'workflow/workflow_list.html'

    def get_queryset(self, **kwargs):
        if self.request.user.is_staff :
            return DocumentType.objects.all()
        else:
            return DocumentType.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_list = CustomUser.objects.all()

        context['user_list'] = user_list
        context['workflow'] = ['internal', 'external']
        return context


def workflow_delete_view(request, *args, **kwargs):
    try:
        body = json.loads(request.body)
    except:
        body = None

    if body['id'] :
        obj = get_object_or_404(DocumentType, id=body['id'])
        return_dict = obj.delete()
        return JsonResponse({ 'message': 'Document Type Removed', 'obj': return_dict })
    else:
        return JsonResponse({ 'message': 'Document Type Removed'})



def workflow_update_view(request, *args, **kwargs):
    try:
        body = json.loads(request.body)
    except:
        body = None

    if body['id'] :
        obj = get_object_or_404(DocumentType, id=body['id'])

        internalWF = None
        externalWF = None

        if len(body['internal']) :
            internalWF = WorkFlowModel(title='internal')
            internalWF.save()

            for step in body['internal']:
                s = SigningStep(name=step['name'], authority= get_object_or_404(CustomUser, username=step['authority']))
                s.save()
                internalWF.steps.add(s)

        if len(body['external']) :
            externalWF = WorkFlowModel(title='external')
            externalWF.save()

            for step in body['external']:
                s = SigningStep(name=step['name'], authority= get_object_or_404(CustomUser, username=step['authority']))
                s.save()
                externalWF.steps.add(s)

        #obj.internal_work_flow.clear()
        #obj.external_work_flow.clear()

        obj.title = body['title']
        obj.internal_work_flow = internalWF
        obj.external_work_flow = externalWF
        obj.save()

        if obj.internal_work_flow :
            internalWF = {
                'title': obj.internal_work_flow.title ,
                'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.internal_work_flow.steps.all()],
            }

        if obj.external_work_flow :
            externalWF = {
                'title': obj.external_work_flow.title,
                'steps': [{ 'name': step.name, 'authority':step.authority.username} for step in obj.external_work_flow.steps.all()],
            }

        return JsonResponse({'id': obj.id, 'title': obj.title, 'internal_work_flow': internalWF, 'external_work_flow': externalWF })
    else :
        return JsonResponse({'error': 'Document Type Object not found.'})






class DocumentCreatedListView(ListView):
	template_name = 'workflow/created_document_list.html'

	def get_queryset(self, **kwargs):
		return Document.objects.filter(created_by=self.request.user)

class DocumentWorkFlowAddView(View):
	form = DocumentForm()

	def get(self, request):
		user_list = CustomUser.objects.all()
		context = {
			'form': self.form,
			'user_list': user_list,
			'workflow': ['internal', 'external']
		}
		return render(request, 'workflow/add_document.html', context=context)

	def post(self, request):
		doc = Document(document_name=request.POST['document_name'], document_type=get_object_or_404(DocumentType, id=request.POST['document_type']), notify_users = True, created_by=request.user)

		if doc.document_type.internal_work_flow :
			doc.internal_wf_step = doc.document_type.internal_work_flow.steps.all()[doc.internal_status].name
		else:
			doc.internal_wf_step = None
			if doc.document_type.external_work_flow :
				doc.external_wf_step = doc.document_type.external_work_flow.steps.all()[doc.external_status].name

			else :
				doc.external_wf_step = None


		doc.save()
		messages.success(request, doc.document_name + ' - Added In WorkFlow - '+ doc.document_type.title)
		return redirect('workflow:documents-in-workflow')


class DocumentExecutionListView(ListView):
	model = Document

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		doc_list = []
		for document in context['document_list']:
		    if document.document_type:
    			if document.document_type.internal_work_flow and (document.internal_wf_step != 'complete'):
    				for step in document.document_type.internal_work_flow.steps.all():
    					if (step.name == document.internal_wf_step) and (step.authority == self.request.user):
    						doc_list.append(document)

    			elif document.document_type.external_work_flow and (document.external_wf_step != 'complete'):
    				for step in document.document_type.external_work_flow.steps.all():
    					if step.name == document.external_wf_step and step.authority == self.request.user :
    						doc_list.append(document)


		context['object_list'] = doc_list
		context['document_list'] = doc_list

		return context


def execute_wf(request, document_name, status, wf):
	authority = wf.steps.all()[status].authority
	step_name = None
	if request.user == authority :
		status += 1
		if status == len(wf.steps.all()) :
			step_name = 'complete'
			messages.success(request, document_name.title() + ' document Signed at all stages.')

		else:
			step_name = wf.steps.all()[status].name
			messages.info(request, document_name.title() + ' document Signed at :'+ wf.steps.all()[status - 1].name + '.')
	else:
		messages.error(request, 'You are NOT authorised')

	return status, step_name



class DocumentVerificationView(View):
	def get(self, request, **kwargs):
		id_ = kwargs.get('id')
		obj = get_object_or_404(Document, id=id_)
		return render(request, 'workflow/document_verify.html', { 'object': obj })

	def post(self, request, **kwargs):
		status = None
		step_name = None
		doc = get_object_or_404(Document, id=request.POST['id_'])

		if doc.document_type.internal_work_flow is not None and doc.internal_status < len(doc.document_type.internal_work_flow.steps.all()):
			status, step_name = execute_wf(request, doc.document_name, doc.internal_status, doc.document_type.internal_work_flow)
			if status and status != doc.internal_status :
				doc.internal_status = status
				doc.internal_wf_step = step_name

				if (doc.internal_wf_step == 'complete') and doc.document_type.external_work_flow is not None:
					doc.external_wf_step = doc.document_type.external_work_flow.steps.all()[0].name

		elif doc.document_type.external_work_flow is not None and doc.external_status < len(doc.document_type.external_work_flow.steps.all()):
			status, step_name = execute_wf(request, doc.document_name, doc.external_status, doc.document_type.external_work_flow)
			if status and status != doc.external_status :
				doc.external_status = status
				doc.external_wf_step = step_name

		elif doc.external_wf_step == 'complete' :
			messages.info(request, 'Document completed External WorkFlow.')
		else:
			messages.error(request, 'No WorkFlow Available')


		if status is not None and step_name is not None :
		    doc.save()

		return redirect('workflow:documents-in-workflow')


