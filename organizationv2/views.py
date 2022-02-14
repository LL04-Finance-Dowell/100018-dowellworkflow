import os,json

from . tokens import generate_token
from django import forms
from django.conf import settings
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_str
from accounts.models import CustomUser
from editor.forms import CreateTemplateForm
from editor.views import get_name, get_userlist
#from admin_v2.models import Company
from workflow.models import WorkFlowModel, SigningStep, DocumentType
from django.contrib.sites.models import Site
#from django.middleware.csrf import force_str
from django.urls import reverse
from django.core.mail import send_mail
from .forms import CreateOrganizationv2Form, CreateProjectForm
from .models import Organizationv2, Project, VerificationToken, Company


# Create your views here.
def get_user_status(user, org_id):
    org = get_object_or_404(Organizationv2, id=org_id)
    company = org.company_orgs.all()[0]

    is_admin        = True if user == company.admin else False
    is_org_lead     = True if user == org.organization_lead else False
    is_project_lead = False
    is_member       = False

    for proj in org.projects.all():
        if user == proj.project_lead:
            is_project_lead = True
        if user in proj.members.all():
            is_member = True
    return is_org_lead, is_project_lead, is_member, is_admin



def add_member_view(request, *args, **kwargs):
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['org_id'])
    member_list = []
    member_type = ''
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    if kwargs['member_type'] == 'org_lead':
        member_type = 'ORG_LEAD'
        member_list.append(org.organization_lead)
    if kwargs['member_type'] == 'project_lead':
        member_type = 'PROJECT_LEAD'
        member_list.append(org.projects.project_lead)
    if kwargs['member_type'] == 'member':
        member_type = 'MEMBER'
        member_list = org.projects.members.all()

    context = {
        'org': org,
        'member_type': member_type,
        'member_list': member_list,
        'is_org_lead': is_org_lead,
        'is_project_lead': is_project_lead,
        'is_member': is_member,
        'is_admin': is_admin
    }

    if is_org_lead or is_project_lead or is_admin:
        return render(request, 'organizationv2/add_members.html', context)

class MembersView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):      
        company = get_object_or_404(Company, id=kwargs['id'])
        context = {'company': company}
        return render(request, 'organizationv2/add_members.html', context)

def add_member(request, company_id):
    print(company_id)
    if request.method == 'POST':
        email=request.POST.get('recipient-name')
        company=Company.objects.get(id=company_id)
        if email != '':
            token_entry = VerificationToken(
                company_id=company.id,
                user_email=email,
                token=generate_token.make_token(request.user))
            token_entry.save()
            print(token_entry.token)
            route = reverse('admin_v2:verify-user', kwargs={'token': token_entry.token})
            link="https://"+request.get_host() + "/"+ route[1:] 
            print(link)         
            send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ email + 'without @ and anything after, password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
            return JsonResponse({ 'status': 'OK', 'message': 'Email sent at ' + token_entry.user_email, 'link': link})
        return JsonResponse({ 'status': 'FAILED', 'message': 'Please provide an email'})

    return JsonResponse({'status': 'FAILED', 'message': 'Must be a post request.'})


class CreateProjectView(View):
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        form = CreateProjectForm()
        return render(request, 'organizationv2/create_project.html', { 'form': form })

    @xframe_options_exempt
    def post(self, request, *args, **kwargs):
        form = CreateProjectForm(request.POST)
        org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
        if form.is_valid():
            selected_proj_leader_pk=request.POST.get('project_lead')
            selected_proj_leader=CustomUser.objects.get(pk=selected_proj_leader_pk)
            selected_proj_leader.is_project_leader=True            
            proj_leader=selected_proj_leader.save()            
            project = form.save()
            org.projects.add(project)

            return redirect('organizationv2:project-management', org_id=org.id, project_id=project.id)
        else :
            messages.error(request, 'Invalid input.')
            return render(request, 'organizationv2/create_project.html', { 'form': form })

def project_management(request, *args, **kwargs):
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    proj = get_object_or_404(Project, id=kwargs['project_id'])
    print(org.organization_lead.username)
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, org.id)

    context = {
        'proj': proj,
        'org':org,
        'is_org_lead': is_org_lead,
        'is_project_lead': is_project_lead,
        'is_member': is_member,
        'is_admin': is_admin
    }
    return render(request, 'organizationv2/project_management.html', context)

# this is configured according to v2
class CreateOrganizationv2(View):
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        form = CreateOrganizationv2Form()
        return render(request, 'organizationv2/create.html', { 'form': form })

    @xframe_options_exempt
    def post(self, request, *args, **kwargs):
        form = CreateOrganizationv2Form(request.POST)        
        company = get_object_or_404(Company, id=kwargs['id'])
        if form.is_valid():            
            selected_org_leader_pk=request.POST.get('organization_lead')
            selected_org_leader=CustomUser.objects.get(pk=selected_org_leader_pk)
            selected_org_leader.is_org_leader=True            
            org = form.save()
            org_leader=selected_org_leader.save()  
            company.organizations.add(org)
            return redirect('admin_v2:admin-org-management', company_id=company.id, org_id=org.id)
        else :
            messages.error(request, 'Invalid input.')
            return render(request, 'organizationv2/create.html', { 'form': form })


class Organizationv2Home(View):
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        org = get_object_or_404(Organizationv2, id=kwargs['id'])
        is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['id'])
        context = {
            'org': org,
            'is_org_lead': is_org_lead,
            'is_project_lead': is_project_lead,
            'is_member': is_member,
            'is_admin': is_admin
        }
        return render(request, 'organizationv2/org_home.html', context)




def org_lead_view(request, *args, **kwargs):
    user=request.user
    #org = get_object_or_404(Organization_v2, organization_lead=user )
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    try:
        proj = get_object_or_404(Project, project_lead=user)
        #proj = get_object_or_404(Project, id=kwargs['project_id'])
    except:
        proj=None
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['id'])

    # context = {
    #     'org': org ,
    #     'is_org_lead': is_org_lead,
    #     'is_project_lead': is_project_lead,
    #     'is_member': is_member,
    #     'is_admin': is_admin
    # }
    context = {
            'org': org ,
            'departments': proj ,
            'is_admin': False,
            'is_org_lead': True,
            'is_project_lead': False,
            'is_member': False
        }

    # if is_org_lead :
        # return render(request, 'organizationv2/dashboard_org_lead.html', context)
    # if is_project_lead :
        # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    return render(request, 'organizationv2/dashboard_org_lead.html', context)


@xframe_options_exempt
def proj_lead_view(request, *args, **kwargs):

    org = get_object_or_404(Organizationv2, id=kwargs['id'])
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['id'])

    # context = {
    #     'org': org ,
    #     'is_org_lead': is_org_lead,
    #     'is_project_lead': is_project_lead,
    #     'is_member': is_member,
    #     'is_admin': is_admin
    # }

    # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    context = {
            'org': org ,
            'is_admin': False,
            'is_org_lead': False,
            'is_project_lead': True,
            'is_member': False
        }

    # if is_org_lead :
        # return render(request, 'organizationv2/dashboard_org_lead.html', context)
    # if is_project_lead :
        # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    return render(request, 'organizationv2/dashboard_proj_lead.html', context)



def workflow_management(request, *args, **kwargs):
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    proj = get_object_or_404(Project, id=kwargs['project_id'])
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, org.id)

    userlist = proj.members
    userlist.add(org.organization_lead)
    userlist.add(proj.project_lead)

    context = {
        'object_list': proj.workflows.all(),
        'user_list': userlist.all() ,
        'workflow': ['internal', 'external'],
        'org': org,
        'project': proj,
        'is_org_lead': is_org_lead,
        'is_project_lead': is_project_lead,
        'is_member': is_member,
        'is_admin': is_admin
    }

    return render(request, 'organizationv2/workflow_list.html', context=context)




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

	org = get_object_or_404(Organizationv2, id=body['org_id'])
	org.workflows.add(obj)
	org.save()
	return JsonResponse({'id': obj.id, 'title': obj.title, 'internal_work_flow': internalWF, 'external_work_flow': externalWF })


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



def create_template(request, *args, **kwargs):
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    proj = get_object_or_404(Project, id=kwargs['project_id'])

    if request.method == 'POST':
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
            proj.templates.add(template)
            return redirect('editor:template-editor', id=template.id)

    CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
    form = CreateTemplateForm()

    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['org_id'])

    context = {
        'form': form,
        'org': org,
        'project': proj,
        'files': proj.templates.all(),
        'is_org_lead': is_org_lead,
        'is_project_lead': is_project_lead,
        'is_member': is_member,
        'is_admin': is_admin
    }

    return render(request, 'doc_template/create_template.html', context=context)

def previous_templates(request, *args, **kwargs):
    org = get_object_or_404(Organizationv2, id=kwargs['org_id'])
    proj = get_object_or_404(Project, id=kwargs['project_id'])
    is_org_lead, is_project_lead, is_member, is_admin = get_user_status(request.user, kwargs['org_id'])

    context = {
        'org': org ,
        'project': proj,
        'files': proj.templates.all(),
        'is_org_lead': is_org_lead,
        'is_project_lead': is_project_lead,
        'is_member': is_member,
        'is_admin': is_admin
    }
    return render(request, 'organizationv2/previous_templates.html', context=context)

'''
@xframe_options_exempt
def user_landing_page(request, *args, **kwargs):
    return render(request, 'organization_v2/verified_token.html', {'status': 'Invalid Token.'})

class CreateTemplate(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        org = get_object_or_404(Organization_v2, id=kwargs['id'])
        CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
        form = CreateTemplateForm()

        is_org_lead, is_project_lead, is_member = get_user_status(request.user, kwargs['id'])
        context = {
            'form': form,
            'files': org.templates.all(),
            'is_staff': is_staff,
            'org': org,
            'is_member': is_member
        }

        return render(request, 'doc_template/create_template.html', context=context)

    @xframe_options_exempt
    def post(self, request, *args, **kwargs):
        form = CreateTemplateForm(request.POST)
        template = None
        path = None
        org = get_object_or_404(Organization_v2, id=kwargs['id'])
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
            org.templates.add(template)
            return redirect('editor:template-editor', id=template.id)

        else:
            messages.error(request, 'Unable to create template.')
            org = get_object_or_404(Organization_v2, id=kwargs['id'])
            is_staff, is_member = get_user_status(request.user, kwargs['id'])

            context = {
                'form': self.form,
                'files': org.templates.all(),
                'is_staff': is_staff,
                'is_member': is_member,
                'org': org
            }
            return render(request, 'doc_template/create_template.html', context=context)



@xframe_options_exempt
def remove_staff_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['user_id'] != '' and credentials['org_id'] != '':
            org = get_object_or_404(Organization_v2, id=credentials['org_id'])
            user = get_object_or_404(CustomUser, id=credentials['user_id'])
            org.staff_members.remove(user)
            return JsonResponse({ 'status': 'OK', 'message': 'User removed from org.'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide user and organization_v2.'})

@xframe_options_exempt
def remove_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['user_id'] != '' and credentials['org_id'] != '':
            org = get_object_or_404(Organization_v2, id=credentials['org_id'])
            user = get_object_or_404(CustomUser, id=credentials['user_id'])
            org.members.remove(user)
            return JsonResponse({ 'status': 'OK', 'message': 'User removed from org.'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide user and organization_v2.'})


class PreviousTemplates(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        org = get_object_or_404(Organization_v2, id=kwargs['id'])

        is_org_lead, is_project_lead, is_member =
        CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
        context = {
            # 'form': form,
             'org': org ,
             'is_staff': is_staff,
             'is_member': is_member,
            'files': org.templates.all()
        }
        return render(request, 'organization_v2/previous_templates.html', context=context)


class MembersView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_staff = False
        is_member = False
        org = get_object_or_404(Organization_v2, id=kwargs['id'])
        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True

        context = {'org': org,
             'is_staff': is_staff,
             'is_member': is_member}
        return render(request, 'organization_v2/add_members.html', context)

class StaffView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_staff = False
        is_member = False
        org = get_object_or_404(Organization_v2, id=kwargs['id'])

        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True

        context = {'org': org,'is_staff': is_staff,'is_member': is_member}
        return render(request, 'organization_v2/add_staff.html', context)


'''
def member_dummy(request):
    context = {

            'is_admin': True,
            'is_org_lead': True,
            'is_project_lead': True,
            'is_member': True
        }

    # if is_org_lead :
        # return render(request, 'organizationv2/dashboard_org_lead.html', context)
    # if is_project_lead :
        # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    return render(request, 'dummy/member_dashboard_dummy.html', context)

def project_dummy(request):
    context = {

            'is_admin': True,
            'is_org_lead': True,
            'is_project_lead': True,
            'is_member': True
        }

    # if is_org_lead :
        # return render(request, 'organizationv2/dashboard_org_lead.html', context)
    # if is_project_lead :
        # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    return render(request, 'dummy/dashboard_proj_lead_dummy.html', context)

def org_dummy(request):
    context = {

            'is_admin': True,
            'is_org_lead': True,
            'is_project_lead': True,
            'is_member': True
        }

    # if is_org_lead :
        # return render(request, 'organizationv2/dashboard_org_lead.html', context)
    # if is_project_lead :
        # return render(request, 'organizationv2/dashboard_proj_lead.html', context)
    return render(request, 'dummy/dashboard_org_lead_dummy.html', context)

