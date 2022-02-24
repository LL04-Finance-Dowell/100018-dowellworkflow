import os
import json
import random
from datetime import datetime, timedelta
from django.views.generic.list import ListView

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from .models import EditorFile, Template
from django.contrib import messages
from django.views import View
from .forms import RequestDocumentForm, CreateTemplateForm
from organizationv2.models import Organizationv2, Project, Company
from django.views.decorators.clickjacking import xframe_options_exempt


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

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.model, id=kwargs['id'])
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
            'template': self.is_template
        }

        return render(request, 'editor/editor.html', context={'document': doc_obj})


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


class DocumentCreateView(View):
    form = RequestDocumentForm()
    model = EditorFile

    @xframe_options_exempt
    def get(self, request):
        context = {
            'form': self.form,
            'files': self.model.objects.filter(created_by=request.user)
        }

        return render(request, 'editor/create_document.html', context=context)

    @xframe_options_exempt
    def post(self, request):
        form = RequestDocumentForm(request.POST)
        doc = None
        path = None
        data = ''
        if form.is_valid() :
            path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')
            template = form.cleaned_data['template']

            if template :
                temp_path = template.file.path

                with open(temp_path, 'r') as tempF:
                    data = tempF.read()

            new_data = json.loads(data)
            for item in new_data:
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
            return redirect('editor:editor', id=doc.id)

        else:
            messages.error(request, 'Unable to create document.')
            return redirect('editor:create-document')



#   route only used by templates
class TemplateEditor(Editor):
    model = Template
    verify = False
    is_template = True

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.model, id=kwargs['id'])
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
                'template': self.is_template
            }

            return render(request, 'editor/editor.html', context={'document': doc_obj})
        else:
            return JsonResponse({ 'status': 'ERROE' , 'message': 'You are not authorized'})


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

    @xframe_options_exempt
    def get(self, request):
        context = {
            'form': self.form,
            'files': Template.objects.all()
        }

        return render(request, 'doc_template/create_template.html', context=context)

    @xframe_options_exempt
    def post(self, request, *args, **kwargs):
        form = CreateTemplateForm(request.POST)
        template = None
        path = None
        if form.is_valid() :
            path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')
            form.instance.file = path
            with open(path, 'w') as f:
                f.write('')
            form.instance.created_by = request.user
            template = form.save()

            for usr in get_userlist(template.document_type):
                template.auth_user_list.add(usr)

            template.save()
            return redirect('editor:template-editor', id=template.id)

        else:
            messages.error(request, 'Unable to create template.')
            context = {
                'form': self.form,
                'files': Template.objects.all()
            }
            return render(request, 'doc_template/create_template.html', context=context)




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
    @xframe_options_exempt
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
        doc_list = []

        for document in context['object_list']:
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
            doc.external_status = doc.document_type.external_status.steps.all()[doc.external_status].name
        doc.save()
        return JsonResponse({'status': 200, 'url': '/editor/documents-in-workflow/' })
    return JsonResponse({'status': 500, 'url': 'Only POST requests are accepted.' })





class DashboardView(View):
    model = EditorFile

    def get(self, request, *args, **kwargs):
        #   Create time filters
        one_week_ago = datetime.today() - timedelta(days=7)
        one_month_ago  = datetime.today()- timedelta(days=30)
        one_year_ago  = datetime.today()- timedelta(days=365)

        org_list = Organizationv2.objects.all()

        # all_files = self.model.objects.all().filter(created_by=request.user)
        all_files = self.model.objects.filter(auth_user_list=request.user)
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
        return render(request, 'editor/dashboard.html', summary)
        #else:
        # return redirect('organization:create-orgniz')





class StatusView2(View):
    model = EditorFile

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        user = request.user
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)
        org_list = Organizationv2.objects.all()
        is_member = False
        is_admin = False
        is_project_lead = False
        is_org_lead = False
        if user.is_member:
            is_member= True
        if user.is_admin:
            is_admin= True
        if user.is_project_lead:
            is_project_lead= True
        if user.is_org_lead:
            is_org_lead= True

        for org in org_list :
            if request.user in org.members.all():
                is_member = True
                break
        all_files = self.model.objects.filter(auth_user_list=request.user)
        ##Apply general filters
        incomplete_internal = all_files.exclude(internal_wf_step='complete').exclude(internal_wf_step__isnull=True)
        completely_complete =  all_files.filter(internal_wf_step='complete',external_wf_step='complete')
        not_in_any_workflow = all_files.filter(internal_wf_step__isnull=True, external_wf_step__isnull=True)
        #Create COntainer
        summary={ 'org': org ,"is_member": is_member,"is_admin": is_admin,"is_project_lead": is_project_lead,"is_org_lead": is_org_lead,}
        ##Populate container
        summary["all_files"]= all_files
        summary["completely_complete"]= completely_complete
        summary["incomplete_internal"]= incomplete_internal
        summary["not_in_any_workflow"]= not_in_any_workflow
        return render(request, 'editor/status.html', summary)

def dashboard(request):
    user = request.user
    company=Company.objects.get(admin=user)
    user_projects = [] #  user is a member of project
    user_companies = []

    projects=Project.objects.all()
    for project in projects:
        if user in project.members.all():
            user_projects.append(project)


    companies = Company.objects.all()
    for company in companies:
        if user in company.members.all():
            user_companies.append(company)

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
            'user':user
        }
        return render(request, 'editor/landing_page.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user}
        return render(request, 'editor/landing_page.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user}
        return render(request, 'editor/landing_page.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user}
        return render(request, 'editor/landing_page.html', context)



class RequestedDocuments(View):
    model = EditorFile

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)
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
        all_files = self.model.objects.filter(auth_user_list=request.user)

        summary={ 'org': org ,'is_staff': is_staff, 'is_member': is_member,}
        ##Populate container
        summary["files"]= all_files

        return render(request, 'editor/requested_documents.html', summary)

class PreviousDocuments(View):
    model = EditorFile

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        ##Get Evry data from Db
        # all_files = self.model.objects.all().filter(created_by=request.user)

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
            'org': org ,'is_staff': is_staff, 'is_member': is_member,
            'files': self.model.objects.filter(created_by=request.user)
        }
        return render(request, 'editor/previous_documents.html', context)


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
            'org': org ,'is_staff': is_staff, 'is_member': is_member
        }

    return render(request, 'editor/dashboard_admin.html', context)





class StatusView(View):
    model = EditorFile

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

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        company = Company.objects.get(admin=request.user)
        org = company.org.get(id=kwargs['org_id'])

        context = {
            'org': org ,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False
        }
        return render(request, 'editor/admin_org_management.html', context)



'''
internal_status, internal_wf_step, external_status, external_wf_step, update_time
document_name, document_type, file_type, file, auth_user_list, created_by, created_on,


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



def request_document(request):
    if request.method == 'POST':
        form = RequestDocumentForm(request.POST)
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            print(form.cleaned_data)
            path = os.path.join(settings.MEDIA_ROOT, get_name() + '.json')

            template = Template.objects.filter(document_type=form.cleaned_data['document_type'])[0]

            if template :
                temp_path = template.file.path

                with open(temp_path, 'r') as tempF:
                    data = tempF.read()

            with open(path, 'w') as f:
                f.write(data)
            doc = EditorFile(document_name=form.cleaned_data['document_name'], document_type=template.document_type, file=path, created_by=request.user)
            doc.save()
            for usr in get_userlist(doc.document_type):
                doc.auth_user_list.add(usr)
            doc.save()
            print('Document saved...')
            return redirect('editor:editor', id=doc.id)
    else:
        print('Form is invalid')
        form = RequestDocumentForm();

    return render(request, 'editor/request_document.html', {'form': form})




'''
