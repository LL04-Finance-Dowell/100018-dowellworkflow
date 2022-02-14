from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.clickjacking import xframe_options_exempt
from django.contrib import messages
from django.http import JsonResponse

from organizationv2.models import Organizationv2,  Company
from django.contrib.auth import logout
from .forms import CreateCompanyForm

from organizationv2.models import VerificationToken
import json
from accounts.models import CustomUser
from django.contrib.sites.models import Site
from django.utils.encoding import force_str
#from django.middleware.csrf import force_str
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
            if company :
                messages.info(request, 'You already have a company.')
                return redirect('admin_v2:dashboard')
        except:
            if form.is_valid():
                form.instance.admin = request.user
                form.save()
                return redirect('admin_v2:dashboard')
    return render(request, 'admin_v2/create_company.html', { 'form': form})


@xframe_options_exempt
def dashboard_admin(request):
    company = Company.objects.get(admin=request.user)

    if company :
        context = {
            'company': company,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False
        }
        return render(request, 'admin_v2/dashboard_admin.html', context)
    else :
        return render(request, 'admin_v2/no_company_error.html', {})



def admin_org_management(request, *args, **kwargs):
    company = get_object_or_404(Company, id=kwargs['company_id'])
    if request.user == company.admin:
        org = company.organizations.get(id=kwargs['org_id'])
        context = {
            'org': org ,
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
            'org': org ,
            'is_admin': False,
            'is_org_lead': True,
            'is_project_lead': False,
            'is_member': False
        }
    if kwargs['position'] == 'is_admin':
        context = {
            'org': org ,
            'is_admin': True,
            'is_org_lead': True,
            'is_project_lead': True,
            'is_member': True
        }
    if kwargs['position'] == 'is_project_lead':
        context = {
            'org': org ,
            'is_admin': False,
            'is_org_lead': False,
            'is_project_lead': True,
            'is_member': False
        }
    if kwargs['position'] == 'is_member':
        context = {
            'org': org ,
            'is_admin': False,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': True
        }
    return render(request, 'admin_v2/admin_org_management_dummy.html', context)



def add_member(request, *args, **kwargs):
    if request.method == 'POST':
        credentials = json.loads(request.body)
        #print(kwargs)# kwags['company_id'], kwargs['org_id']
        #print(credentials)#{'email': 'qwe@qwe.com', 'member': 'MEMBER'}
        if credentials['email'] != '':
            token_entry = VerificationToken(
                org_id=kwargs['org_id'],
                user_email=credentials['email'],
                user_position=credentials['member'],
                token=force_str())
            token_entry.save()
            route = reverse('admin_v2:verify-user', kwargs={'token': token_entry.token})
            link = Site.objects.get_current().domain + route[1:]
            send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ credentials['email'] + ', password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
            return JsonResponse({ 'status': 'OK', 'message': 'Email sent at ' + token_entry.user_email, 'link': link})
        return JsonResponse({ 'status': 'FAILED', 'message': 'Please provide an email'})

    return JsonResponse({'status': 'FAILED', 'message': 'Must be a post request.'})


@xframe_options_exempt
def verify_user(request, token):
    logout(request)

    token_entry = None
    try:
        token_entry = VerificationToken.objects.get(token=token)
    except:
        token_entry = None

    if token_entry :
        curr_user = None
        try:
            curr_user = CustomUser.objects.get(email=token_entry.user_email)
            messages.info(request, 'You already have account please login.')
        except:
            user_name = token_entry.user_email.split('@')[0]
            company_id=token_entry.company_id
            company=Company.objects.get(id=company_id)
            curr_user = CustomUser.objects.create_user(user_name, token_entry.user_email, 'password123Dowell')
            company.members.add(curr_user)
            curr_user.save()

        token_entry.delete()
        messages.info(request, 'Welcome, You can now Login')
        return redirect('home')
    else :
        return redirect('home')





























# @xframe_options_exempt
# def verify_user(request, *args, **kwargs):
#     logout(request)
#     token_entry = None
#     try:
#         token_entry = VerificationToken.objects.get(token=kwargs['token'])
#     except:
#         token_entry = None

#     if token_entry :
#         curr_user = None
#         try:
#             curr_user = CustomUser.objects.get(email=token_entry.user_email)
#             messages.info(request, 'You already have account please login.')
#         except:
#             user_name = token_entry.user_email.split('@')[0]
#             curr_user = CustomUser.objects.create_user(user_name, token_entry.user_email, 'password123Dowell')
#             curr_user.save()

#         org = get_object_or_404(Organizationv2, id=token_entry.org_id)

#         if curr_user:
#             if token_entry.user_position == 'ORG_LEAD':
#                 org.organization_lead = curr_user

#             if token_entry.user_position == 'PROJECT_LEAD':
#                 org.project_lead = curr_user

#             if token_entry.user_position == 'MEMBER':
#                 org.members.add(curr_user)

#             org.save()

#         token_entry.delete()
#         messages.info(request, 'You can now logIn')
#         return redirect('home')
#     else :
#         return redirect('home')




# def verify_user(request, *args, **kwargs):
#     logout(request)
#     token_entry = None
#     try:
#         token_entry = VerificationToken.objects.get(token=kwargs['token'])
#     except:
#         token_entry = None

#     if token_entry :
#         curr_user = None
#         try:
#             curr_user = CustomUser.objects.get(email=token_entry.user_email)
#             messages.info(request, 'You already have account please login.')
#         except:
#             user_name = token_entry.user_email.split('@')[0]
#             curr_user = CustomUser.objects.create_user(user_name, token_entry.user_email, 'password123Dowell')
#             curr_user.save()

#         org = get_object_or_404(Organizationv2, id=token_entry.org_id)

#         if curr_user:
#             if token_entry.user_position == 'ORG_LEAD':
#                 org.organization_lead = curr_user

#             if token_entry.user_position == 'PROJECT_LEAD':
#                 org.project_lead = curr_user

#             if token_entry.user_position == 'MEMBER':
#                 org.members.add(curr_user)

#             org.save()

#         token_entry.delete()
#         messages.info(request, 'You can now logIn')
#         return redirect('home')
#     else :
#         return redirect('home')