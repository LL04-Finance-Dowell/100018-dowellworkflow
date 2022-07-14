import os
import json
import random
from datetime import datetime, timedelta
from django.views.generic.list import ListView
import base64
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from .models import Template
from .models_document import EditorFile
from django.contrib import messages
from django.views import View
from .forms import RequestDocumentForm, CreateTemplateForm
from organizationv2.models import Organizationv2, Project, Company
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
#pdf imports
from django.http import FileResponse
from django import forms
import io
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Table, TableStyle, Frame, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter
from fpdf import FPDF


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



def get_user_status_company(user, company_id):
    company = get_object_or_404(Company, id=company_id)

    is_admin = None
    is_org_lead = None
    is_project_lead = None
    is_member = None
    user_org = None

    if company :
        is_admin = True if user == company.admin else False

        if not is_admin:
            for org in company.organizations.all():
                if org.organization_lead == user:
                    is_org_lead = True
                    user_org = org
                    break
                if not is_project_lead:
                    for proj in org.projects.all():
                        if user == proj.project_lead:
                            is_project_lead = True
                            user_org = org
                            break
                        if user in proj.members.all():
                            is_member = True
                            user_org = org
                else:
                    break
    print('OutPut from Status :', is_org_lead, is_project_lead, is_member, is_admin, user_org, company)
    return is_org_lead, is_project_lead, is_member, is_admin, user_org, company



class DocumentViewer(View):
    verify = False
    is_template = False
    doc_viewer = True
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.model, id=kwargs['doc_id'])

        company = get_object_or_404(Company, id=kwargs['company_id'])

        if company :
            if document :
                data = None

                with open(document.file.path, 'r') as f:
                    data = f.read()

                doc_obj = {
                    'id': document.id,
                    'name': document.document_name,
                    'created_by': document.created_by.username,
                    'auth_user_list': [user.username for user in document.auth_user_list.all()],
                    'file': data,
                    'verify': self.verify,
                    'template': self.is_template,
                    'doc_viewer': self.doc_viewer,
                    'company': company
            }

            return render(request, 'editor/editor.html', context={'document': doc_obj})
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})




class Editor(View):
    verify = False
    is_template = False
    doc_viewer = False
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):

        company = get_object_or_404(Company, id=kwargs['company_id'])

        if company :
            document = get_object_or_404(self.model, id=kwargs['doc_id'])

            data = None

            with open(document.file.path, 'r') as f:
                data = f.read()

            doc_obj = {
                'id': document.id,
                'name': document.document_name,
                'created_by': document.created_by.username,
                'auth_user_list': [user.username for user in document.auth_user_list.all()],
                'file': data,
                'verify': self.verify,
                'template': self.is_template,
                'doc_viewer': self.doc_viewer,
                'company': company
            }

            return render(request, 'editor/editor.html', context={'document': doc_obj})
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})

@csrf_exempt
@xframe_options_exempt
def testing_editor(request, *args, **kwargs):
    data = ''
    path = os.path.join(settings.MEDIA_ROOT, 'BI2T08RM8V.json')
    with open(path, 'r') as tempF:
        data = tempF.read()
    newData = json.loads(data)
    for item in newData:
        #datalist.append(item.keys())
        if('type' in item.keys() and item['type'] != "TABLE_INPUT"):
            if( 'auth_user' in item.keys() and ((item['auth_user'] == "") or (item['auth_user'] == "null"))):
                item['auth_user'] = request.user.username

        elif('type' in item.keys() and item['type'] == "TABLE_INPUT"):
            for value_dict in item['data'].values():
                if( 'auth_user' in value_dict.keys() and ((value_dict['auth_user'] == '') or (value_dict['auth_user'] == 'null'))):
                    value_dict['auth_user'] = request.user.username

    return render(request, 'editor/testing.html', {'data': newData})


from .report_connection import save_document_entry

class DocumentCreateView(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, **kwargs):
        project = None
        company = get_object_or_404(Company, id=kwargs['company_id'])
        if company :
            org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
            try:
                project = get_object_or_404(Project, id=kwargs['project_id'])
                RequestDocumentForm.base_fields['template'] = forms.ModelChoiceField(queryset=project.templates.all())
                form = RequestDocumentForm()
                return render(request, 'editor/create_document.html', {'form': form, 'company': company, 'org': org, 'proj': project})
            except:
                project = None

            RequestDocumentForm.base_fields['template'] = forms.ModelChoiceField(queryset=org.templates.all())
            form = RequestDocumentForm()
            return render(request, 'editor/create_document.html', {'form': form, 'company': company, 'org': org})
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})

    @csrf_exempt
    @xframe_options_exempt
    def post(self, request, **kwargs):
        company = get_object_or_404(Company, id=kwargs['company_id'])
        if company :
            org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
            try:
                project = get_object_or_404(Project, id=kwargs['project_id'])
            except:
                project = None
            form = RequestDocumentForm(request.POST)
            doc = None
            path = None
            data = ''
            print('Form Instance : ', form)
            if form.is_valid() :
                path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')
                try:
                    template = form.cleaned_data['template']
                except:
                    if project:
                        messages.error(request, 'Template Error!')
                        return redirect('editor:create-document', company_id=company.id, org_id=org.id, project_id=project.id)
                    else:
                        messages.error(request, 'Template Error!')
                        return redirect('editor:create-document', company_id=company.id, org_id=org.id)

                if template :
                    temp_path = template.file.path

                    with open(temp_path, 'r') as tempF:
                        data = tempF.read()

                try:
                    new_data = json.loads(data)
                except:
                    new_data = {}

                for page_content in new_data:
                    for item in page_content:
                        if('type' in item.keys() and item['type'] != "TABLE_INPUT"):
                            if( 'auth_user' in item.keys() and ((item['auth_user'] == "") or (item['auth_user'] == "null"))):
                                item['auth_user'] = request.user.username

                        elif('type' in item.keys() and item['type'] == "TABLE_INPUT"):
                            for value_dict in item['data'].values():
                                if( 'auth_user' in value_dict.keys() and ((value_dict['auth_user'] == '') or (value_dict['auth_user'] == 'null'))):
                                    value_dict['auth_user'] = request.user.username

                with open(path, 'w') as f:
                    f.write(json.dumps(new_data))

                doc = EditorFile(document_name=form.cleaned_data['document_name'], document_type=template.document_type, file=path, created_by = request.user)
                doc.save()
                for usr in get_userlist(doc.document_type):
                    doc.auth_user_list.add(usr)
                doc.auth_user_list.add(request.user)
                doc.save()
                company.documents.add(doc)
                company.save()
                report = save_document_entry(doc)
                print("Document Report: ", report)
                return redirect('editor:editor', doc_id=doc.id, company_id=company.id)

            else:
                messages.error(request, 'Unable to create document.')
                return redirect('editor:create-document', company_id=company.id, org_id=org.id)
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})



#   route only used by templates
class TemplateEditor(Editor):
    model = Template
    verify = False
    is_template = True
    doc_viewer = False

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        company = get_object_or_404(Company, id=kwargs['company_id'])
        if company :
            document = get_object_or_404(self.model, id=kwargs['temp_id'])
            if document and (request.user == document.created_by):
                data = None

                with open(document.file.path, 'r') as f:
                    data = f.read()

                doc_obj = {
                    'id': document.id,
                    'name': document.template_name,
                    'created_by': document.created_by.username,
                    'auth_user_list': [user.username for user in document.auth_user_list.all()],
                    'file': data,
                    'verify': self.verify,
                    'template': self.is_template,
                    'doc_viewer': self.doc_viewer
                }
                return render(request, 'editor/editor.html', context={'document': doc_obj})
            else:
                return JsonResponse({ 'status': 'ERROR' , 'message': 'You are not authorized'})
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})


def save_template(request):
    body = json.loads(request.body)
    fileObj = get_object_or_404(Template, id=body['file_id'])
    path = ''

    if fileObj.file and (request.user == fileObj.created_by):
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

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(request.user, kwargs['company_id'])

        if company :
            CreateTemplateForm.base_fields['copy_template'] = forms.ModelChoiceField(queryset=user_org.templates.all())
            self.form = CreateTemplateForm()
            context = {
                'form': self.form,
                'is_project_lead': is_project_lead,
                'is_org_lead': is_org_lead,
                'is_member': is_member,
                'is_admin': is_admin,
                'company': company,
                'org': user_org,
                'company': company,
            }

            return render(request, 'doc_template/create_template.html', context=context)
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})


    @csrf_exempt
    @xframe_options_exempt
    def post(self, request, *args, **kwargs):
        company = get_object_or_404(Company, id=kwargs['company_id'])
        if company :
            form = CreateTemplateForm(request.POST)
            path = None
            if form.is_valid() :
                path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')

                print('Template Form submitted: ')

                old_template = form.cleaned_data['copy_template']

                print('Old Template', old_template.template_name)
                data = {}

                if old_template :
                    temp_path = old_template.file.path
                    with open(temp_path, 'r') as tempF:
                        data = tempF.read()
                        tempF.close()

                    with open(path, 'w') as f:
                        f.write(data)
                else:
                    return JsonResponse({ 'status': 'ERROR' , 'message': 'No template selected'})

                template = Template(template_name=form.cleaned_data['template_name'], document_type=form.cleaned_data['document_type'], file=path, created_by=request.user)
                template.save()
                for usr in get_userlist(template.document_type):
                    template.auth_user_list.add(usr)

                template.save()
                return redirect('editor:template-editor', {'company_id':company.id, 'temp_id':template.id})

            else:
                messages.error(request, 'Unable to create template.')
                context = {
                    'form': self.form,
                    'files': Template.objects.all(),
                    'is_project_lead': True,

                }
                return render(request, 'doc_template/create_template.html', context=context)
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})





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
            'created_by': file.created_by.id,

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


from workflow.models import SigningStep, WorkFlowModel, DocumentType

class DocumentWorkFlowAddView(View):

    @csrf_exempt
    @xframe_options_exempt
    def post(self, request, **kwargs):
        is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(request.user, kwargs['company_id'])
        if company :
            body = None
            try:
                body = json.loads(request.body)

            except:
                body = None

            if body['file_id'] :
                doc = get_object_or_404(EditorFile, id=body['file_id'])

            print('DOCUMENT TYPE : ', doc.document_type)


            new_step = SigningStep(name='Last', authority=request.user)
            new_step.save()
            new_ex_wf = WorkFlowModel(title='external_wf')
            new_ex_wf.save()

            print('New Steps :', new_step, '; New WF', new_ex_wf)

            try:
                for each_step in doc.document_type.external_work_flow.steps.all():
                    new_ex_wf.steps.add(each_step)
            except:
                print('error in copying external wf')

            new_ex_wf.save()
            new_ex_wf.steps.add(new_step)
            new_ex_wf.save()

            old_internal_wf = get_object_or_404(WorkFlowModel, id=doc.document_type.internal_work_flow.id)

            try:
                new_doc_type = DocumentType(title='execution_wf', internal_work_flow=old_internal_wf, external_work_flow=new_ex_wf)
                new_doc_type.save()
            except:
                print('Error in creating new DT')

            try:
                doc.document_type=new_doc_type
                print('Doc TYpe', doc.document_type)
            except:
                print('Error in assigning new DT')
            doc.save()

            if doc.document_type.internal_work_flow :
                doc.internal_wf_step = doc.document_type.internal_work_flow.steps.all()[doc.internal_status].name
            else:
                doc.internal_wf_step = None
                if doc.document_type.external_work_flow :
                    doc.external_wf_step = doc.document_type.external_work_flow.steps.all()[doc.external_status].name
                else :
                    doc.external_wf_step = None
            doc.company_id = company.id
            doc.save()
            messages.success(request, doc.document_name + ' - Added In WorkFlow - '+ doc.document_type.title)
            return JsonResponse({ 'status': 200, 'url': '/editor/'+str(company.id)+'/documents-in-workflow/' })
        else:
            return JsonResponse({ 'status': 'ERROR' , 'message': 'A User must be related with company'})




class DocumentCreatedListView(ListView):
    ''' GET Request for list of documents created by user.'''
    template_name = 'editor/created_document_list.html'

    def get_queryset(self, **kwargs):
        company = get_object_or_404(Company, id=self.kwargs['company_id'])
        return company.documents.filter(created_by=self.request.user)

    def get_context_data(self, *args,**kwargs):
        context = super().get_context_data(**kwargs)
        is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(self.request.user, self.kwargs['company_id'])
        context['company'] = company
        context['org'] = user_org

        return context


class DocumentExecutionListView(ListView):
    ''' GET Request for list of Documents that are in a WorkFlow.'''
    model = EditorFile

    def get_context_data(self, *args,**kwargs):
        doc_list = []
        context = super().get_context_data(**kwargs)
        is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(self.request.user, self.kwargs['company_id'])

        for document in company.documents.all():
            if document.document_type:
                if document.document_type.internal_work_flow and (document.internal_wf_step != 'complete'):
                    for step in document.document_type.internal_work_flow.steps.all():
                        if (step.name == document.internal_wf_step) and (step.authority == self.request.user):
                            if not document.rejected_by :
                                doc_list.append(document)

                elif document.document_type.external_work_flow and (document.external_wf_step != 'complete'):
                    for step in document.document_type.external_work_flow.steps.all():
                        if step.name == document.external_wf_step and step.authority == self.request.user :
                            if not document.rejected_by:
                                doc_list.append(document)


        context['object_list'] = doc_list
        context['document_list'] = doc_list
        context['company'] = company
        context['org'] = user_org

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


def workflowVerification(request, doc):
    status = None
    step_name = None
    if doc.document_type.internal_work_flow is not None and doc.internal_status < len(doc.document_type.internal_work_flow.steps.all()):
        status, step_name = execute_wf(request, doc.document_name, doc.internal_status, doc.document_type.internal_work_flow)
        if status and status != doc.internal_status :
            doc.internal_status = status
            doc.internal_wf_step = step_name
            doc.reject_message  = None
            doc.rejected_by = None

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
	is_template = False
	doc_viewer = False

	def post(self, request, **kwargs):
		doc = get_object_or_404(EditorFile, id=request.POST['id_'])
		print('Got to the DocumentVerificationView function anyways')
		doc, status, step_name = workflowVerification(request, doc)
		if status is not None and step_name is not None :
		    data = json.loads(request.POST['documentData'])
		    path = doc.file.path
		    with open(path, 'w') as file:
		        file.write(json.dumps(data))
		        doc.company_id = kwargs['company_id']
		    doc.save()
		    return redirect('editor:documents-in-workflow', company_id=kwargs['company_id'])
		else:
		    print("Got Error About to give 403")
		    return JsonResponse({'status': 403, 'url': '/got here' })


class RejectedDocuments(ListView):
    model = EditorFile
    template_name = 'editor/reject_list.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)

        doc_list = []

        for document in context['object_list']:
            if document.document_type:
                if document.document_type.internal_work_flow and (document.internal_wf_step != 'complete'):
                    for step in document.document_type.internal_work_flow.steps.all():
                        if (step.name == document.internal_wf_step) and (step.authority == self.request.user):
                            if document.rejected_by :
                                doc_list.append(document)

                elif document.document_type.external_work_flow and (document.external_wf_step != 'complete'):
                    for step in document.document_type.external_work_flow.steps.all():
                        if step.name == document.external_wf_step and step.authority == self.request.user :
                            if document.rejected_by :
                                doc_list.append(document)

        context['object_list'] = doc_list
        context['document_list'] = doc_list
        print("Output from rejection", context['object_list'])
        context['company'] = get_object_or_404(Company, id=self.kwargs['company_id'])

        return context

class InvalidDocuments(ListView):
    model = EditorFile
    template_name = 'editor/documents_on_halt.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)

        doc_list = EditorFile.objects.all()

        context['object_list'] = doc_list
        context['document_list'] = doc_list

        return context


def documentRejectionRequest(request, *args, **kwargs):
    if request.method == 'POST':
        body = json.loads(request.body)
        doc = get_object_or_404(EditorFile, id=body['file_id'])
        #print(doc.internal_status, doc.internal_wf_step, doc.external_status, doc.external_wf_step, doc.update_time)
        if doc.document_type.internal_work_flow is not None and doc.internal_wf_step != 'complete':
            if (doc.internal_status > 0):
                doc.internal_status = (doc.internal_status - 1)
                doc.internal_wf_step = doc.document_type.internal_work_flow.steps.all()[doc.internal_status].name
                doc.reject_message  = body['reason']
                doc.rejected_by = request.user
            else:
                doc.internal_status = 0
                doc.internal_wf_step = ''
        elif doc.document_type.external_work_flow is not None and doc.external_wf_step != 'complete':
            doc.external_status = (doc.external_status - 1) if (doc.external_status >= 1) else 0
            doc.external_wf_step = doc.document_type.external_work_flow.steps.all()[doc.external_status].name
        doc.company_id = kwargs['company_id']
        doc.save()
        return JsonResponse({'status': 200, 'url': '/editor/'+ str(kwargs['company_id']) +'/documents-in-workflow/' })
    return JsonResponse({'status': 500, 'url': 'Only POST requests are accepted.' })





class DashboardView(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        #   Create time filters
        one_week_ago = datetime.today() - timedelta(days=7)
        one_month_ago  = datetime.today()- timedelta(days=30)
        one_year_ago  = datetime.today()- timedelta(days=365)

        company = get_object_or_404(Company, id=kwargs['company_id'])
        org = Organizationv2.objects.none()
        proj = Project.objects.none()
        try:
            proj = get_object_or_404(Project, id=kwargs['project_id'])
        except:
            pass

        for orgn in company.organizations.all():
            if (request.user is orgn.organization_lead):
                org = orgn
                break
            if (request.user in orgn.members.all()):
                org = orgn
                break



        # all_files = self.model.objects.all().filter(created_by=request.user)
        all_files = company.documents.filter(auth_user_list=request.user)
        ##Apply the general filters
        incomplete_internal = all_files.exclude(internal_wf_step='complete').exclude(internal_wf_step__isnull=True)
        completely_complete =  all_files.filter(internal_wf_step='complete',external_wf_step='complete')
        not_in_any_workflow = all_files.filter(internal_wf_step__isnull=True, external_wf_step__isnull=True)
        ##Create time container


        summary = {"one_week":{}, "one_month":{}, "one_year":{} }
        ##Apply time filters to get necessary data
        summary["one_week"]["all_files"]= all_files.filter(created_on__gte=one_week_ago)
        summary["one_month"]["all_files"]= all_files.filter(created_on__gte=one_month_ago)
        summary["one_year"]["all_files"]= all_files.filter(created_on__gte=one_year_ago)
        summary["one_week"]["completely_complete"]= completely_complete.filter(created_on__gte=one_week_ago)
        summary["one_month"]["completely_complete"]= completely_complete.filter(created_on__gte=one_month_ago)
        summary["one_year"]["completely_complete"]= completely_complete.filter(created_on__gte=one_year_ago)
        summary["one_week"]["not_in_any_workflow"]= not_in_any_workflow.filter(created_on__gte=one_week_ago)
        summary["one_month"]["not_in_any_workflow"]= not_in_any_workflow.filter(created_on__gte=one_month_ago)
        summary["one_year"]["not_in_any_workflow"]= not_in_any_workflow.filter(created_on__gte=one_year_ago)
        summary["one_week"]["incomplete_internal"]= incomplete_internal.filter(created_on__gte=one_week_ago)
        summary["one_month"]["incomplete_internal"]= incomplete_internal.filter(created_on__gte=one_month_ago)
        summary["one_year"]["incomplete_internal"]= incomplete_internal.filter(created_on__gte=one_year_ago)
        summary["company"] = get_object_or_404(Company, id=kwargs['company_id'])
        summary["org"] = org
        summary["proj"] = proj

        summary["department"] = department


        return render(request, 'editor/dashboard.html', summary)
        #else:
        # return redirect('organization:create-orgniz')





class StatusView2(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(request.user, kwargs['company_id'])

        all_files = self.model.objects.filter(auth_user_list=request.user)
        ##Apply general filters
        incomplete_internal = all_files.exclude(internal_wf_step='complete').exclude(internal_wf_step__isnull=True)
        completely_complete =  all_files.filter(internal_wf_step='complete',external_wf_step='complete')
        not_in_any_workflow = all_files.filter(internal_wf_step__isnull=True, external_wf_step__isnull=True)
        #Create COntainer
        summary={ 'org': user_org ,"is_member": is_member,"is_admin": is_admin,"is_project_lead": is_project_lead,"is_org_lead": is_org_lead, "company": company}
        ##Populate container
        summary["all_files"]= all_files
        summary["completely_complete"]= completely_complete
        summary["incomplete_internal"]= incomplete_internal
        summary["not_in_any_workflow"]= not_in_any_workflow
        return render(request, 'editor/status.html', summary)

@csrf_exempt
@xframe_options_exempt
def dashboard(request, **kwargs):
    user = request.user
    user_projects = [] #  user is a member of project
    user_companies = []

    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()

    projects=Project.objects.all()
    for project in projects:
        if user in project.members.all():
            user_projects.append(project)
    companies = Company.objects.all()
    for comp in companies:
        if user in comp.members.all():
            user_companies.append(comp)

    if user.is_admin and company is not None:
        organizations=company.organizations.all()
        departments=[]
        for organization in organizations:
            dpts=organization.projects.all()
            for dpt in dpts:
                departments.append(dpt)
        context={
            'user_companies':user_companies,
            'user_projects':user_projects,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,

        }
        return render(request, 'editor/landing_page.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user, 'company': organizations[0].company}
        return render(request, 'editor/landing_page.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user, 'company': user_projects[0].organization.company}
        return render(request, 'editor/landing_page.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user, 'company': user_companies[0]}
        return render(request, 'editor/landing_page.html', context)


@csrf_exempt
@xframe_options_exempt
def home_page(request):
    user = request.user
    user_projects = [] #  user is a member of project
    user_companies = []
    #   is_org_lead, is_project_lead, is_member, is_admin, user_org, company = get_user_status_company(user, company_id)

    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()

    projects=Project.objects.all()
    for project in projects:
        if user in project.members.all():
            user_projects.append(project)


    companies = Company.objects.all()
    for comp in companies:
        if user in comp.members.all():
            user_companies.append(comp)

    if user.is_admin and company is not None:
        organizations=company.organizations.all()
        departments=[]
        for organization in organizations:
            dpts=organization.projects.all()
            for dpt in dpts:
                departments.append(dpt)
        context={
            'user_companies':user_companies,
            'user_projects':user_projects,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,

        }
        return render(request, 'editor/landing_page.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user, 'company': organizations[0].company}
        return render(request, 'editor/landing_page.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user, 'company': user_projects[0].organization.company}
        return render(request, 'editor/landing_page.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user, 'company': user_companies[0]}
        return render(request, 'editor/landing_page.html', context)





class RequestedDocuments(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)
        org_list = Organizationv2.objects.all()
        is_staff = False
        is_member = False

        for org in org_list :
            if request.user is org.organization_lead :
                is_staff = True
                break
            for project in org.projects.all():
                if request.user is project.project_lead:
                    is_staff = True
            if request.user in org.members.all():
                is_member = True
                break
        all_files = self.model.objects.filter(auth_user_list=request.user)

        summary={ 'org': org ,'is_staff': is_staff, 'is_member': is_member, 'company': org.company, "files": all_files}

        return render(request, 'editor/requested_documents.html', summary)

class PreviousDocuments(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)

        org_list = Organizationv2.objects.all()
        is_staff = False
        is_member = False

        for org in org_list :
            if request.user is org.organization_lead :
                is_staff = True
                break
            for project in org.projects.all():
                if request.user is project.project_lead:
                    is_staff = True
            if request.user in org.members.all():
                is_member = True
                break
        context = {
            'org': org ,
            'is_staff': is_staff,
            'is_member': is_member,
            'company': org.company,
            'files': self.model.objects.filter(created_by=request.user),
        }

        return render(request, 'editor/previous_documents.html', context)

@csrf_exempt
@xframe_options_exempt
def dashboard_admin(request):
    org_list = Organizationv2.objects.all()
    is_staff = False
    is_member = False

    for org in org_list :
        if request.user in org.staff_members.all():
            is_staff = True
            break
        if request.user in org.members.all():
            is_member = True
            break
    context = {
            'org': org ,'is_staff': is_staff, 'is_member': is_member, 'company': org.company
        }

    return render(request, 'editor/dashboard_admin.html', context)


class StatusView(View):
    model = EditorFile

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)
        org_list = Organizationv2.objects.all()

        all_files = self.model.objects.filter(auth_user_list=request.user)

        all_files = self.model.objects.filter(auth_user_list=request.user)
        ##Apply general filters
        incomplete_internal = all_files.exclude(internal_wf_step='complete').exclude(internal_wf_step__isnull=True)
        completely_complete =  all_files.filter(internal_wf_step='complete',external_wf_step='complete')
        not_in_any_workflow = all_files.filter(internal_wf_step__isnull=True, external_wf_step__isnull=True)
        #Create COntainer
        summary = {}
        ##Populate container
        summary["all_files"]= all_files
        summary["completely_complete"]= completely_complete
        summary["incomplete_internal"]= incomplete_internal
        summary["not_in_any_workflow"]= not_in_any_workflow
        if kwargs["status"] ==  "all_docs":
            summary["req_status"] = all_files
            summary["status_title"] = "All Documents"

        if kwargs["status"] == "complete_docs" :
            summary["req_status"] = completely_complete
            summary["status_title"] = "Complete Documents"

        if kwargs["status"] == "incomplete_docs" :
            summary["req_status"] = incomplete_internal
            summary["status_title"] = "Incomplete Documents"

        if kwargs["status"] == "saved_docs" :
            summary["req_status"] = not_in_any_workflow
            summary["status_title"] = "Saved Documents"

        if kwargs["status"] == "test_docs" :
            # summary["req_status"] = not_in_any_workflow
            summary["status_title"] = "Test Documents"
        return render(request, 'editor/status.html', summary)



class AdminOrgManagement(View):

    @csrf_exempt
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        company = Company.objects.get(admin=request.user)
        org = company.org.get(id=kwargs['org_id'])

        context = {
            'org': org ,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False,
            'company': org.company
        }
        return render(request, 'editor/admin_org_management.html', context)

def get_pdf(request):
    signed_files = EditorFile.objects.filter(internal_wf_step="complete")
    lines = []
    for signed_file in signed_files:
        name = "Document Name: " + str(signed_file.document_name)
        typed = "Type of Document: " + str(signed_file.document_type)
        typef = "Type of file: " + str(signed_file.file_type)
        user_list = "Authorised Users: " + str(signed_file.auth_user_list)
        creator = "Created By: " + str(signed_file.created_by)
        created_at = "Document Generated At: "+str(signed_file.created_on)
        generated_at = "Report Generated At: " + str(datetime.datetime.now())
        lines += [name, typed, typef, user_list,
                  creator, created_at, generated_at]
        lines.append("============================")
        try:
            path = os.path.join(settings.MEDIA_ROOT, get_name(
                signed_file.file.path) + '.json')
            print(path)
            with open("E:/Dowell/media/files/HT5VUOC69E.json") as f:
                # print(signed_file.file.path)
                data_s = json.load(f)
                for data in data_s:
                    width = data['width']
                    height = data['height']
                    top = data['top']
                    left = data['left']
                    type = data['type']
                    auth_users = data['auth_user']
                    content = data['data']
                if data_s:
                    lines += [type, auth_users, content, ]
                    lines.append("============================")
        except:
            pass
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter, bottomup=0)
    textobj = c.beginText()
    textobj.setTextOrigin(inch, inch)
    textobj.setFont("Helvetica", 14)
    for line in lines:
        textobj.textLine(line)
    c.drawText(textobj)
    c.showPage()
    c.save()
    buf.seek(0)
    # return sthe file in pdf format
    return FileResponse(buf, as_attachment=True, filename="Signed_Documents.pdf")

def get_pdf_json(request):
    signed_file = EditorFile.objects.filter(internal_wf_step="complete")[1]
    lines = []
    texts = []
    signs = []
    images = []
    name = "Document Name: " + str(signed_file.document_name)
    typed = "Type of Document: " + str(signed_file.document_type)
    typef = "Type of file: " + str(signed_file.file_type)
    user_list = "Authorised Users: " + str(signed_file.auth_user_list)
    creator = "Created By: " + str(signed_file.created_by)
    created_at = "Document Generated At: "+str(signed_file.created_on)
    generated_at = "Report Generated At: " + str(datetime.now())
    lines += [typed, typef, user_list,
              creator, created_at, generated_at]

    with open(signed_file.file.path) as f:
        data_s = json.load(f)
        for component in data_s:
            if component['type'] == "IMG_INPUT":
                images.append(component)
            elif component['type'] == "SIGN_INPUT":
                signs.append(component)
            else:
                texts.append(component)
                #lines += [width, height, top, left, auth_users, content]
    buf = io.BytesIO()
    pdf = canvas.Canvas(buf, pagesize=letter)
    pdf.setTitle(name)
    pdf.drawString(220, 750, name)
    # subtitle
    pdf.setFillColorRGB(0, 0, 255)
    pdf.setFont("Courier-Bold", 24)
    pdf.drawString(100, 720, name)
    # draw a line
    pdf.line(30, 710, 550, 710)
    # Adding text/paragraph
    text = pdf.beginText(40, 680)
    text.setFont("Courier", 12)
    text.setFillColor(colors.black)
    for line in lines:
        text.textLine(line)
    pdf.drawText(text)
    # Draw an Image
    for image in images:
        width = image['width']
        height = image['height']
        top = image['top']
        left = image['left']
        image = image['data']
        #print(image, int(top.strip("px")), int(left.strip("px")))
        pdf.drawInlineImage(image, int(top.strip("px"))-200, int(left.strip("px")))
    for sign in signs:
        width = sign['width']
        height = sign['height']
        top = sign['top']
        left = sign['left']
        image = sign['data']
        try:
            pdf.drawInlineImage(image, int(top.strip("px"))-200,
                                int(left.strip("px")))
        except:
            pass
    pdf.showPage()
    pdf.save()
    buf.seek(0)
    return FileResponse(buf, as_attachment=True, filename=name+".pdf")

title = 'This is just a Test Title'


class PDF(FPDF):
    def header(self):
        # font
        self.set_font('helvetica', 'B', 15)
        # Calculate width of title and position
        title_w = self.get_string_width(title) + 6
        doc_w = self.w
        self.set_x((doc_w - title_w) / 2)
        self.set_line_width(0.3)
        # Title
        self.cell(title_w, 10, title, border=1, ln=1, align='C', fill=0)
        # Line break
        self.ln(10)

    # Page footer
    def footer(self):
        # Set position of the footer
        self.set_y(-15)
        # set font
        self.set_font('helvetica', 'I', 8)
        # Set font color grey
        self.set_text_color(169, 169, 169)

    # Adding signs to a document
    def add_signs(self, signed_file):
        signs = []
        with open(signed_file.file.path) as f:
            data_s = json.load(f)
            for component in data_s:
                if component['type'] == "SIGN_INPUT":
                    signs.append(component)
        for sign in signs:
            encoded_sign = sign['data']
            encoded_sign = bytes(encoded_sign, encoding='utf-8')
            width = int(sign['width'].strip('px'))/3.7795
            height = int(sign['height'].strip('px'))/3.7795
            top = int(sign['top'].strip('px'))/3.7795
            left = int(sign['left'].strip('px'))/3.7795
            sign_image = base64.decodebytes(encoded_sign)
            print(width, height, top, left)
            if encoded_sign:
                self.image(sign_image, x=left, y=top, w=width, h=height)
            else:
                pass
    # Chapter content

    def add_images(self, signed_file):
        images = []
        with open("E:/Dowell/media/files/HT5VUOC69E.json") as f:
            data_s = json.load(f)
            for component in data_s:
                if component['type'] == "IMG_INPUT":
                    images.append(component)
        for image in images:
            encoded_image = image['data']
            encoded_image = bytes(encoded_image, encoding='utf-8')
            width = int(image['width'].strip('px'))/3.7795
            height = int(image['height'].strip('px'))/3.7795
            top = int(image['top'].strip('px'))/3.7795
            left = int(image['left'].strip('px'))/3.7795
            sign_image = base64.decodebytes(encoded_image)
            print(width, height, top, left)
            if encoded_image:
                self.image(sign_image)  # left, top, -width, height)
            else:
                pass

    def add_texts(self, signed_file):
        lines = []
        name = "Document Name: " + str(signed_file.document_name)
        typed = "Type of Document: " + str(signed_file.document_type)
        typef = "Type of file: " + str(signed_file.file_type)
        user_list = "Authorised Users: " + str(signed_file.auth_user_list)
        creator = "Created By: " + str(signed_file.created_by)
        created_at = "Document Generated At: "+str(signed_file.created_on)
        generated_at = "Report Generated At: " + str(datetime.now())
        lines += [name, typed, typef, user_list,
                  creator, created_at, generated_at]
        # set font
        self.set_font('times', '', 12)
        # insert text
        for line in lines:
            self.multi_cell(0, 5, line)
            # line break
            self.ln()
        # end each chapter
        self.set_font('times', '', 12)

    def add_contents(self, signed_file):
        self.add_signs(signed_file)
        self.add_images(signed_file)
        # self.add_texts(signed_file)


def generate_pdf(request):  # Create a PDF object
    signed_file = EditorFile.objects.filter(internal_wf_step="complete")[0]
    pdf = PDF('P', 'mm', 'Letter')
    # Add Page
    pdf.add_page()
    pdf.add_contents(signed_file)
    pdf.output('test.pdf')
    try:
        return FileResponse(open('test.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        pass





###New Views
def company(request, *args, **kwargs):
    context = {}
    user_companies = []
    if request.user:
        is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)
        context = {
                'company': company,
                'org': organization,
                'project': project,
                'is_org_lead': is_org_lead,
                'is_project_lead': is_project_lead,
                'is_member' : is_member,
                'is_admin': is_admin,
        }

        if company :
            context['user_companies']: [ company, ]
            return render(request, 'pages/company_page.html', context)
        else :
            companies = Company.objects.all()
            for comp in companies:
                for mem in comp.members.all():
                    if user == mem:
                        user_companies.append(comp)

        if company or len(user_companies) > 0:
            context['user_companies'] = user_companies
            return render(request, 'editor/company_page.html', context)
        else:
            return redirect('admin_v2:create-company')
    else:
        return redirect('admin_v2:create-company')




def organization(request, *args, **kwargs):
    if request.user:
        context = {}
        user_organization = []
        is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)

        context = {
                'company': company,
                'org': organization,
                'project': project,
                'is_org_lead': is_org_lead,
                'is_project_lead': is_project_lead,
                'is_member' : is_member,
                'is_admin': is_admin,
        }

        if organization :
            context['user_organizations']: [ organization, ]

        else :
            organizations = Organizationv2.objects.all()
            for org in organizations:
                for member in org.members.all():
                    if user == members :
                        user_organization.append(comp)

            context['user_organizations'] = user_organization
        return render(request, 'editor/company_organizations.html', context)
    else:
        return redirect('admin_v2:create-company')



def department(request, *arg, **kwargs):
    user_projects = []
    if request.user:
        is_org_lead, is_project_lead, is_member, is_admin, company, organization, department = get_user_status(request.user)
        context = {
            'is_admin': is_admin,
            'is_org_lead': is_org_lead,
            'is_project_lead': is_project_lead,
            'is_member': is_member,
            'department': department
        }
        if project :
            context['user_organizations']: [ project, ]

        else :

            proejcts = Project.objects.all()
            for proejct in proejcts:
                for mem in project.members.all():
                    if user == mem:
                        user_projects.append(comp)

            context['user_organizations'] = user_projects
        return render(request, 'editor/company_organizations.html', context)
    else:
        return redirect('organization:create-orgniz')

def dashboard2(request, **kwargs):
    user = request.user
    user_projects = [] #  user is a member of project
    user_companies = []

    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()

    projects=Project.objects.all()
    for project in projects:
        if user in project.members.all():
            user_projects.append(project)


    companies = Company.objects.all()
    for comp in companies:
        if user in comp.members.all():
            user_companies.append(comp)

    if user.is_admin and company is not None:
        organizations=company.organizations.all()
        departments=[]
        for organization in organizations:
            dpts=organization.projects.all()
            for dpt in dpts:
                departments.append(dpt)
        context={
            'user_companies':user_companies,
            'user_projects':user_projects,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,

        }
        return render(request, 'editor/landing_page3.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user, 'company': organizations[0].company}
        return render(request, 'editor/landing_page3.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user, 'company': user_projects[0].organization.company}
        return render(request, 'editor/landing_page3.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user, 'company': user_companies[0]}
        return render(request, 'editor/landing_page3.html', context)


