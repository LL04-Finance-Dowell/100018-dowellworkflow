import os, json

from django.contrib import messages
from django.views import View
from django.views.generic.list import ListView

from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

from accounts.models import CustomUser
#from accounts.models import User

from django.conf import settings
from editor.forms import CreateTemplateForm
from editor.views import get_name, get_userlist

from django.contrib.sites.models import Site
from django.utils.encoding import force_str
#from django.middleware.csrf import force_str

from django.core.mail import send_mail
from django.contrib.auth import logout

from .models import Organization, VerificationToken
from .forms import CreateOrganizationForm

from django import forms
from django.views.decorators.clickjacking import xframe_options_exempt


def get_user_status(user, org_id):
    org = get_object_or_404(Organization, id=org_id)
    is_staff = False
    is_member = False

    if user in org.staff_members.all():
        is_staff = True
    if user in org.members.all():
        is_member = True

    return is_staff, is_member




# Create your views here.
class CreateOrganization(View):
    @xframe_options_exempt
    def get(self, request):
        form = CreateOrganizationForm()
        return render(request, 'organization/create.html', { 'form': form })

    @xframe_options_exempt
    def post(self, request):
        form = CreateOrganizationForm(request.POST)
        if form.is_valid():
            org = form.save()
            org.staff_members.add(request.user)
            org.save()
            return redirect('organization:org-home', id=org.id)

        return JsonResponse({'ERROR': 'Invalid credentials'})

@xframe_options_exempt
def user_landing_page(request, *args, **kwargs):
    return render(request, 'organization/verified_token.html', {'status': 'Invalid Token.'})

@xframe_options_exempt
def verify_user(request, *args, **kwargs):
    logout(request)
    token_entry = None
    try:
        token_entry = VerificationToken.objects.get(token=kwargs['token'])
    except:
        token_entry = None

    if token_entry :
        curr_user = None
        try:
            curr_user = CustomUser.objects.get(email=token_entry.user_email)
            messages.info(request, 'You already have account please login.')
        except:
            curr_user = CustomUser.objects.create_user(token_entry.user_email, token_entry.user_email, 'password123Dowell')
            curr_user.save()

        org = get_object_or_404(Organization, id=token_entry.org_id)
        if curr_user:
            if token_entry.user_position == 'STAFF':
                org.staff_members.add(curr_user)
            elif token_entry.user_position == 'MEMBER':
                org.members.add(curr_user)
        token_entry.delete()
        messages.info(request, 'You can now logIn')
        return redirect('organization:org-home', id=token_entry.org_id)
    else :
        return redirect('organization:user-status')

class OrganizationHome(View):
    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        is_staff, is_member = get_user_status(request.user, kwargs['id'])
        if is_staff :
            return render(request, 'organization/org_home.html', {'org': org, 'is_staff': is_staff, 'is_member': is_member})
        else:
            return redirect('home')



class OrgWorkflowListView(ListView):
    template_name = 'organization/workflow_list.html'

    @xframe_options_exempt
    def get(self, request, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        member_list = org.members.all()
        staff_list = org.staff_members.all()
        is_staff, is_member = get_user_status(request.user, kwargs['id'])
        context = {
            'object_list': org.workflows.all(),
            'user_list': staff_list.union(member_list),
            'workflow': ['internal', 'external'],
            'org': org,
            'is_staff': is_staff,
            'is_member': is_member
        }

        return render(request, 'organization/workflow_list.html', context=context)



class CreateTemplate(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, *args, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
        form = CreateTemplateForm()

        is_staff, is_member = get_user_status(request.user, kwargs['id'])
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
        org = get_object_or_404(Organization, id=kwargs['id'])
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
            org = get_object_or_404(Organization, id=kwargs['id'])
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
def submit_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['email'] != '':
            token_entry = VerificationToken(org_id=kwargs['id'], user_email=credentials['email'], user_position=credentials['member'], token=force_str())
            token_entry.save()
            route = reverse('organization:verify-user', kwargs={'token': token_entry.token})
            link = Site.objects.get_current().domain + route[1:]
            send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ credentials['email'] + ', password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
            return JsonResponse({ 'status': 'OK', 'message': 'Email sent at ' + token_entry.user_email, 'link': link})
        return JsonResponse({ 'status': 'FAILED', 'message': 'Please provide an email'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide an email.'})

@xframe_options_exempt
def remove_staff_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['user_id'] != '' and credentials['org_id'] != '':
            org = get_object_or_404(Organization, id=credentials['org_id'])
            user = get_object_or_404(CustomUser, id=credentials['user_id'])
            org.staff_members.remove(user)
            return JsonResponse({ 'status': 'OK', 'message': 'User removed from org.'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide user and organization.'})

@xframe_options_exempt
def remove_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['user_id'] != '' and credentials['org_id'] != '':
            org = get_object_or_404(Organization, id=credentials['org_id'])
            user = get_object_or_404(CustomUser, id=credentials['user_id'])
            org.members.remove(user)
            return JsonResponse({ 'status': 'OK', 'message': 'User removed from org.'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide user and organization.'})


class PreviousTemplates(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        # org_list = Organization.objects.all()
        is_staff = False
        is_member = False

        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True


        CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
        context = {
            # 'form': form,
             'org': org ,
             'is_staff': is_staff,
             'is_member': is_member,
            'files': org.templates.all()
        }
        return render(request, 'organization/previous_templates.html', context=context)


class MembersView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_staff = False
        is_member = False
        org = get_object_or_404(Organization, id=kwargs['id'])
        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True

        context = {'org': org,
             'is_staff': is_staff,
             'is_member': is_member}
        return render(request, 'organization/add_members.html', context)

class StaffView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_staff = False
        is_member = False
        org = get_object_or_404(Organization, id=kwargs['id'])

        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True

        context = {'org': org,'is_staff': is_staff,'is_member': is_member}
        return render(request, 'organization/add_staff.html', context)

class ProjectLeaderView(View):
    is_template = True

    @xframe_options_exempt
    def get(self, request, **kwargs):
        is_staff = False
        is_member = False
        org = get_object_or_404(Organization, id=kwargs['id'])
        #user = get_object_or_404(CustomUser, id=kwargs['id'])
        users=CustomUser.objects.all()

        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True
        context = {'org': org,'is_staff': is_staff,'is_member': is_member, 'users':users}
        return render(request, 'organization/add_project_leader.html', context)


def makeProjectLeader(request, id):
    user=CustomUser.objects.get(pk=id)
    if user.is_project_leader:
        messages.error(request, "User is already a Project Leader")
    else:
        user.is_project_leader=True
        user.save()
        messages.success(request, "User successfully promoted to Project Leader!")
    return redirect("/")


 #if request.method == "POST":
         #   user_to_be_pl= User.objects.get(id=id2)
          #  user_to_be_pl.is_proj_leader=true

           # return messages.success(request,"User successfully promoted to a project leader")
