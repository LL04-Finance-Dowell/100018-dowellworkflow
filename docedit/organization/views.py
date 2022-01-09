import os, json

from django.contrib import messages
from django.views import View
from django.views.generic.list import ListView

from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

from accounts.models import CustomUser

from django.conf import settings
from editor.forms import CreateTemplateForm
from editor.views import get_name, get_userlist

from django.contrib.sites.models import Site
from django.middleware.csrf import _get_new_csrf_token

from django.core.mail import send_mail
from django.contrib.auth import logout

from .models import Organization, VerificationToken
from .forms import CreateOrganizationForm

from django import forms

# Create your views here.
class CreateOrganization(View):
    def get(self, request):
        form = CreateOrganizationForm()
        return render(request, 'organization/create.html', { 'form': form })

    def post(self, request):
        form = CreateOrganizationForm(request.POST)
        if form.is_valid():
            org = form.save()
            org.staff_members.add(request.user)
            org.save()
            return redirect('organization:org-home', id=org.id)

        return JsonResponse({'ERROR': 'Invalid credentials'})

def user_landing_page(request, *args, **kwargs):
    return render(request, 'organization/verified_token.html', {'status': 'Invalid Token.'})


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
    def get(self, request, *args, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])

        is_staff = False
        is_member = False

        if request.user in org.staff_members.all():
            is_staff = True
        if request.user in org.members.all():
            is_member = True

        return render(request, 'organization/org_home.html', {'org': org, 'is_staff': is_staff, 'is_member': is_member})



class OrgWorkflowListView(ListView):
    template_name = 'organization/workflow_list.html'

    def get(self, request, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        member_list = org.members.all()
        staff_list = org.staff_members.all()
        context = {
            'object_list': org.workflows.all(),
            'user_list': staff_list.union(member_list),
            'workflow': ['internal', 'external'],
            'org_id': org.id
        }

        return render(request, 'organization/workflow_list.html', context=context)



class CreateTemplate(View):
    is_template = True

    def get(self, request, **kwargs):
        org = get_object_or_404(Organization, id=kwargs['id'])
        CreateTemplateForm.base_fields['document_type'] = forms.ModelChoiceField(queryset=org.workflows.all())
        form = CreateTemplateForm()
        context = {
            'form': form,
            'files': org.templates.all()
        }

        return render(request, 'doc_template/create_template.html', context=context)

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
            context = {
                'form': self.form,
                'files': org.templates.all()
            }
            return render(request, 'doc_template/create_template.html', context=context)


def submit_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        if credentials['email'] != '':
            token_entry = VerificationToken(org_id=kwargs['id'], user_email=credentials['email'], user_position=credentials['member'], token=_get_new_csrf_token())
            token_entry.save()
            route = reverse('organization:verify-user', kwargs={'token': token_entry.token})
            link = Site.objects.get_current().domain + route[1:]
            send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ credentials['email'] + ', password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
            return JsonResponse({ 'status': 'OK', 'message': 'Email sent at ' + token_entry.user_email, 'link': link})
        return JsonResponse({ 'status': 'FAILED', 'message': 'Please provide an email'})
    return JsonResponse({ 'status': 'FAILED', 'message': 'You must provide an email.'})



def add_members(request, id):
    org = get_object_or_404(Organization, id=id)
    user_list = CustomUser.objects.all()
    return render (request,'organization/add_members.html',{'org': org, 'user_list': user_list})

def add_staff(request, id):
    org = get_object_or_404(Organization, id=id)
    user_list = CustomUser.objects.all()
    return render (request,'organization/add_staff.html', {'org': org, 'user_list': user_list})
