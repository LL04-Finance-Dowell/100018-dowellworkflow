import os
import json
import random
from accounts.models import CustomUser
from django.views.generic.list import ListView

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from .models import EditorFile, Template
from django.contrib import messages
from django.views import View
from .forms import CreateDocumentForm, CreateTemplateForm





def get_name():
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
    string = ''

    for _ in range(10):
        string += chars[random.randrange(0, len(chars) - 1 , 1)]

    return string


def get_userlist(doc_type):
    #   Get user List from given document type
    user_list = []
    if doc_type.internal_work_flow :
        for step in doc_type.internal_work_flow.steps.all() :
            user_list.append(step.authority)

    if doc_type.external_work_flow :
        for step in doc_type.external_work_flow.steps.all() :
            user_list.append(step.authority)
    return user_list


class Editor(View):
    verify = False
    is_template = False
    model = EditorFile

    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.model, id=kwargs['id'])
        data = None

        with open(document.file.path, 'r') as f:
            data = f.read()

        doc_obj = {
            'id': document.id,
            'name': document.document_name,
            'auth_user_list': [user.username for user in document.auth_user_list.all()],
            'file': data,
            'verify': self.verify,
            'template': self.is_template
        }

        return render(request, 'editor/editor.html', context={'document': doc_obj})



class DocumentCreateView(View):
    form = CreateDocumentForm()
    model = EditorFile
    def get(self, request):
        context = {
            'form': self.form,
            'files': self.model.objects.filter(created_by=request.user)
        }

        return render(request, 'editor/create_document.html', context=context)

    def post(self, request):
        form = CreateDocumentForm(request.POST)
        doc = None
        path = None
        data = ''
        if form.is_valid() :
            form.instance.created_by = request.user
            path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')
            form.instance.file = path

            template = Template.objects.filter(document_type = form.instance.document_type)[0]

            if template :
                temp_path = template.file.path

                with open(temp_path, 'r') as tempF:
                    data = tempF.read()

            with open(path, 'w') as f:
                f.write(data)
            doc = form.save()
            for usr in get_userlist(doc.document_type):
                doc.auth_user_list.add(usr)
            doc.save()

            return redirect('editor:editor', id=doc.id)

        else:
            messages.error(request, 'Unable to create document.')
            return redirect('editor:create-document')


#   route only used by templates
class TemplateEditor(Editor):
    model = Template
    verify = False
    is_template = True
    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.model, id=kwargs['id'])
        data = None

        with open(document.file.path, 'r') as f:
            data = f.read()

        doc_obj = {
            'id': document.id,
            'name': document.template_name,
            'file': data,
            'verify': self.verify,
            'template': self.is_template
        }

        return render(request, 'editor/editor.html', context={'document': doc_obj})


def save_template(request):
    body = json.loads(request.body)
    fileObj = get_object_or_404(Template, id=body['file_id'])
    path = ''

    if fileObj.file :
        path = fileObj.file.path
        with open(path, 'w') as file:
            file.write(json.dumps(body['content']))

        file_obj = {
            'file_id': fileObj.id,
            'name': fileObj.template_name,
            'file': fileObj.file.path,
        }
        return JsonResponse({ 'status': 'OK' , 'file': file_obj})
    else:
        return JsonResponse({ 'status': 'ERROE' , 'message': 'You are not authorized'})


class CreateTemplate(View):
    is_template = True
    form = CreateTemplateForm()

    def get(self, request):
        context = {
            'form': self.form,
            'files': Template.objects.all()
        }

        return render(request, 'editor/create_document.html', context=context)

    def post(self, request, *args, **kwargs):
        form = CreateTemplateForm(request.POST)
        template = None
        path = None
        if form.is_valid() :
            path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')
            form.instance.file = path
            with open(path, 'w') as f:
                f.write('')
            template = form.save()
            return redirect('editor:template-editor', id=template.id)

        else:
            messages.error(request, 'Unable to create template.')
            return redirect('editor:create-template')




def save_file(request):
    fileObj = None
    body = json.loads(request.body)
    path = ''

    fileObj = get_object_or_404(EditorFile, id=body['file_id'])

    if fileObj.created_by == request.user :
        path = fileObj.file.path
        with open(path, 'w') as file:
            file.write(json.dumps(body['content']))

        file_obj = {
            'file_id': fileObj.id,
            'name': fileObj.document_name,
            'file': fileObj.file.path,
            'created_by': fileObj.created_by.id
        }
        return JsonResponse({ 'status': 'OK' , 'file': file_obj})
    else:
        return JsonResponse({ 'status': 'ERROE' , 'message': 'You are not authorized'})


def get_files(request):
    files = EditorFile.objects.filter(created_by=request.user)

    file_list = []

    for file in files:
        data = None

        with open(file.file.path, 'r') as ff:
            data = json.loads(ff.read())

        f = {
            'file_id': file.id,
            'name': file.document_name,
            'file': data,
            'created_by': file.created_by.id
        }

        file_list.append(f)

    return JsonResponse({ 'file': file_list })

def editor_file(request):
    data = None
    if request.method == 'POST':
        body = json.loads(request.body)
        file = get_object_or_404(EditorFile, id=body['id'])

        with open(file.file.path, 'r') as f:
            data = f.read()

    return JsonResponse({ 'file': data })



class DocumentWorkFlowAddView(View):

    def post(self, request):
        body = None
        try:
            body = json.loads(request.body)

        except:
            body = None

        if body['file_id'] :
            doc = get_object_or_404(EditorFile, id=body['file_id'])

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
        return JsonResponse({ 'status': 200, 'url': '/editor/documents-in-workflow/' })#redirect('editor:documents-in-workflow')


class DocumentCreatedListView(ListView):
    ''' GET Request for list of documents created by user.'''
    template_name = 'editor/created_document_list.html'

    def get_queryset(self, **kwargs):
        return EditorFile.objects.filter(created_by=self.request.user)


class DocumentExecutionListView(ListView):
    ''' GET Request for list of Documents that are in a WorkFlow.'''
    model = EditorFile
    template_name = 'editor/document_list.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(context)
        doc_list = []

        for document in context['object_list']:
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

def workflowVerification(request, doc, status, step_name):
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
    return doc, status, step_name

class DocumentVerificationView(Editor):
	verify = True

	def post(self, request, **kwargs):
		status = None
		step_name = None
		doc = get_object_or_404(EditorFile, id=request.POST['id_'])
		data = json.loads(request.POST['documentData'])
		doc, status, step_name = workflowVerification(request, doc, status, step_name)


		if status is not None and step_name is not None :
			doc.save()
			path = doc.file.path
			with open(path, 'w') as file:
				file.write(json.dumps(data))
			return redirect('editor:documents-in-workflow')#JsonResponse({ 'status': 200, 'url': '/editor/documents-in-workflow/' })

		else:
		    return JsonResponse({'status': 403, 'url': '/editor/documents-in-workflow/' })



'''
def save_file(request):
    body = json.loads(request.body)
    fileObj = None
    path = ''

    if body['file_id'] :
        try:
            fileObj = get_object_or_404(EditorFile, id=body['file_id'])
            path = fileObj.file.path
        except:
            return JsonResponse({ 'error': 'File not found'})
    else:
        name = get_name()
        path = os.path.join(settings.MEDIA_ROOT, name + '.json')
        fileObj = EditorFile(name=name, file=path, created_by=request.user)

    with open(path, 'w') as file:
        file.write(json.dumps(body['content']))

    if fileObj:
        fileObj.save()

    file_obj = {
        'file_id': fileObj.id,
        'name': fileObj.name,
        'file': fileObj.file.path,
        'created_by': fileObj.created_by.id
    }


    return JsonResponse({ 'status': 'OK' , 'file': file_obj})

'''
