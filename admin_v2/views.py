from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.clickjacking import xframe_options_exempt
from django.contrib import messages
from django.http import JsonResponse

from organizationv2.models import Company
from django.contrib.auth import logout
from .forms import CreateCompanyForm

from organizationv2.models import VerificationToken
import json
from accounts.models import CustomUser
from django.contrib.sites.models import Site
from django.urls import reverse
from django.core.mail import send_mail


# Create your views here. return redirect('editor:editor', id=doc.id)
@xframe_options_exempt
def create_company(request):
    form = CreateCompanyForm()
    if request.method == 'POST':
        form = CreateCompanyForm(request.POST)
        try:
            company = Company.objects.get(admin=request.user)
            if company:
                messages.info(request, 'You already have a company.')
                return redirect('admin_v2:dashboard')
        except:
            if form.is_valid():
                user = request.user
                user.is_admin = True
                admin = user.save()  # promote user to admin status
                form.instance.admin = request.user
                form.save()
                user.save()
                messages.info(request, 'You created a company.')
                return redirect('admin_v2:dashboard')
    return render(request, 'admin_v2/create_company.html', {'form': form})


@xframe_options_exempt
def company_dashboard(request):
    try:
        company = Company.objects.get(admin=request.user)
    except:
        company = None

    if company:
        context = {
            'company': company,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False
        }
        return render(request, 'admin_v2/company_dashboard.html', context)
    else:
        return redirect('pages:error')


def admin_org_management(request, *args, **kwargs):
    company = get_object_or_404(Company, id=kwargs['company_id'])
    if request.user == company.admin:
        org = company.organizations.get(id=kwargs['org_id'])
        context = {
            'org': org,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False
        }
        return render(request, 'admin_v2/admin_org_management.html', context)


def admin_org_management_dummy(request, *args, **kwargs):
    company = get_object_or_404(Company, id=kwargs['company_id'])
    if request.user == company.admin:
        org = company.organizations.get(id=kwargs['org_id'])
    if kwargs['position'] == 'is_org_lead':
        context = {
            'org': org,
            'is_admin': False,
            'is_org_lead': True,
            'is_project_lead': False,
            'is_member': False
        }
    if kwargs['position'] == 'is_admin':
        context = {
            'org': org,
            'is_admin': True,
            'is_org_lead': True,
            'is_project_lead': True,
            'is_member': True
        }
    if kwargs['position'] == 'is_project_lead':
        context = {
            'org': org,
            'is_admin': False,
            'is_org_lead': False,
            'is_project_lead': True,
            'is_member': False
        }
    if kwargs['position'] == 'is_member':
        context = {
            'org': org,
            'is_admin': False,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': True
        }
    return render(request, 'admin_v2/admin_org_management_dummy.html', context)


@xframe_options_exempt
def verify_user(request, token):
    logout(request)

    token_entry = None
    try:
        token_entry = VerificationToken.objects.get(token=token)
    except:
        token_entry = None

    if token_entry:
        curr_user = None
        try:
            curr_user = CustomUser.objects.get(email=token_entry.user_email)
            messages.info(request, 'You already have account please login.')
        except:
            user_name = token_entry.user_email.split('@')[0]
            company_id = token_entry.company_id
            company = Company.objects.get(id=company_id)
            curr_user = CustomUser.objects.create_user(
                user_name, token_entry.user_email, 'password123Dowell')
            company.members.add(curr_user)
            curr_user.save()

        token_entry.delete()
        messages.info(request, 'Welcome, You can now Login')
        return redirect('home')
    else:
        return redirect('home')
