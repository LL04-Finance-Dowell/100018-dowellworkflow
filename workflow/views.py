from django.http import JsonResponse
from django.views.generic.list import ListView
import json
from .models import SigningStep, WorkFlowModel, DocumentType

from accounts.models import CustomUser
from django.shortcuts import get_object_or_404
from django.views.decorators.clickjacking import xframe_options_exempt
from organization.models import Organization
#   from editor.models import EditorFile
#   from django.contrib import messages
#   from django.views import View

# Create your views here.

@xframe_options_exempt
def create_document_type(request, *args, **kwargs):
	try:
		body = json.loads(request.body)
		print(body)
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

	org = get_object_or_404(Organization, id=body['org_id'])
	org.workflows.add(obj)
	org.save()
	return JsonResponse({'id': obj.id, 'title': obj.title, 'internal_work_flow': internalWF, 'external_work_flow': externalWF })

@xframe_options_exempt
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

    @xframe_options_exempt
    def get_queryset(self, **kwargs):
        if self.request.user.is_staff :
            return DocumentType.objects.all()
        else:
            return DocumentType.objects.none()

    @xframe_options_exempt
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_list = CustomUser.objects.all()

        context['user_list'] = user_list
        context['workflow'] = ['internal', 'external']
        return context


@xframe_options_exempt
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


@xframe_options_exempt
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


