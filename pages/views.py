from django.shortcuts import render, redirect #, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt

from organizationv2.models import Company, Organizationv2, Project

# Create your views here.
def get_user_status(user):
    company = Company.objects.none()
    organization = Organizationv2.objects.none()
    project = Project.objects.none()

    for comp in Company.objects.all():
        if user == comp.admin:
            company = comp

    for org in Organizationv2.objects.all():
        if user == org.organization_lead:
            organization = org

    for proj in Project.objects.all():
        if user == proj.project_lead:
            project = proj

    is_admin, is_org_lead, is_project_lead, is_member = False, False, False, False

    try:
        if company :
            is_admin        = True if user == company.admin else False
            is_org_lead     = True if user == organization.organization_lead else False #
            is_project_lead = True if user == project.project_lead else False
            is_member       = True if user else False

            for proj in org.projects.all():
                if user == proj.project_lead:
                    is_project_lead = True
                if user in proj.members.all():
                    is_member = True
    except:
        company = None


    return is_org_lead, is_project_lead, is_member, is_admin, company, organization, project


@xframe_options_exempt
def home(request, *args, **kwargs):
    if request.user.is_authenticated :
        is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)

        context = {
            'company': company,
            'org': organization,
            'is_org_lead': is_org_lead,
            'is_project_lead': is_project_lead,
            'is_member' : is_member,
            'is_admin': is_admin,
        }
        return render(request, 'pages/members.html', context=context)

    else:
        return HttpResponse('<h1> Please get a subsciption then try.</h1>')

def home_members(request, *args, **kwargs):
    if request.user.is_authenticated :
        is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)

        context = {
            'company': company,
            'org': organization,
            'is_org_lead': is_org_lead,
            'is_project_lead': is_project_lead,
            'is_member' : is_member,
            'is_admin': is_admin,
        }
        return render(request, 'pages/members.html', context=context)
    else:
        return HttpResponse('<h1> Please get a subsciption then try.</h1>')


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
        return render(request, 'pages/organizations.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user, 'company': organizations[0].company}
        return render(request, 'pages/organizations.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user, 'company': user_projects[0].organization.company}
        return render(request, 'pages/organizations.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user, 'company': user_companies[0]}
        return render(request, 'pages/organizations.html', context)



def company(request, *args, **kwargs):
    context = {}
    user_companies = []
    if request.user.is_authenticated:
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
            return render(request, 'editor/company_members.html', context)
        else :
            companies = Company.objects.all()
            for comp in companies:
                for mem in comp.members.all():
                    if request.user == mem:
                        user_companies.append(comp)

        if company or len(user_companies) > 0:
            context['user_companies'] = user_companies
            return render(request, 'editor/company_members.html', context)
        else:
            return redirect('admin_v2:create-company')
    else:
        return redirect('admin_v2:create-company')




def organization(request, *args, **kwargs):
    user = request.user
    user_projects = []
    user_companies = []
    user_organizations = []
    is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)
    member_count =0
    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()
    try:
        member_company =  Company.objects.filter(members=user)
        member_count = len(member_company)
    except:
        member_company = Company.objects.none()
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
            'user_organizations':organizations,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,
            'member_count':member_count

        }
        return render(request, 'editor/company_organizations.html', context)
    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'user_organizations':organizations,'member_count':member_count,'departments':departments, 'user':user, 'company': organizations[0].company}
        # return render(request, 'editor/landing_page12.html', context)
        return render(request, 'editor/company_organizations.html', context)
    # if request.user:
    #     context = {}
    #     user_organization = []
    #     user_projects = []
    #     is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)

    #     context = {
    #             'company': company,
    #             'org': organization,
    #             'project': project,
    #             'is_org_lead': is_org_lead,
    #             'is_project_lead': is_project_lead,
    #             'is_member' : is_member,
    #             'is_admin': is_admin,
    #     }

    #     if organization :
    #         context['user_organizations']: [ organization, ]

    #     else :
    #         organizations = Organizationv2.objects.all()
    #         for org in organizations:
    #             for member in org.members.all():
    #                 if request.user == member :
    #                     user_organization.append(org)

    #         context['user_organizations'] = user_organization
        # return render(request, 'editor/company_organizations.html', context)
    else:
        return redirect('admin_v2:create-company')



def department(request, *arg, **kwargs):
    user = request.user
    user_projects = []
    user_companies = []
    user_organizations = []
    member_count =0
    is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)
    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()
    try:
        member_company =  Company.objects.filter(members=user)
        member_count = len(member_company)
    except:
        member_company = Company.objects.none()
    if user.is_admin and company is not None:
        organizations=company.organizations.all()
        departments=[]
        for organization in organizations:
            dpts=organization.projects.all()
            for dpt in dpts:
                departments.append(dpt)
        context={
            'user_companies':user_companies,
            'user_projects':departments,
            'user_organizations':organizations,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,
            'member_count':member_count

        }
        return render(request, 'editor/company_departments.html', context)
    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':departments, 'user':user, 'member_count':member_count ,'company': user_projects[0].organization.company}
        # return render(request, 'editor/landing_page12.html', context)
        return render(request, 'editor/company_departments.html', context)
def member(request, *arg, **kwargs):
    user = request.user
    user_projects = []
    user_companies = []
    user_organizations = []
    is_org_lead, is_project_lead, is_member, is_admin, company, organization, project = get_user_status(request.user)
    member_count=0
    try:
        company=Company.objects.get(admin=user)
    except:
        company = Company.objects.none()
    try:
        member_company =  Company.objects.filter(members=user)
        member_count = len(member_company)
    except:
        member_company = Company.objects.none()

    if user.is_admin and company is not None:
        organizations=company.organizations.all()
        departments=[]
        for organization in organizations:
            dpts=organization.projects.all()
            for dpt in dpts:
                departments.append(dpt)
        context={
            'user_companies':user_companies,
            'user_projects':departments,
            'user_organizations':organizations,
            'company': company,
            'organizations':organizations,
            'departments':departments,
            'user':user,
            'member_count':member_count

        }
        return render(request, 'editor/company_members.html', context)
    else:
        if member_company is not None:
            departments=Project.objects.filter(members=user).exclude(project_lead=user) #user is project lead
            context={'departments':departments,'user_companies':user_companies,'user_projects':departments, 'user':user,'member_count':member_count, 'company':member_company[0]}
            # return render(request, 'editor/landing_page12.html', context)
            return render(request, 'editor/company_members.html', context)
    # user_projects = []
    # if request.user:
    #     is_org_lead, is_project_lead, is_member, is_admin, company, organization, department = get_user_status(request.user)
    #     context = {
    #         'is_admin': is_admin,
    #         'is_org_lead': is_org_lead,
    #         'is_project_lead': is_project_lead,
    #         'is_member': is_member,
    #         'department': department
    #     }
    #     if department :
    #         context['user_organizations']: [ department, ]

    #     else :

    #         proejcts = Project.objects.all()
    #         for project in proejcts:
    #             for mem in project.members.all():
    #                 if request.user == mem:
    #                     user_projects.append(project)

    #         context['user_organizations'] = user_projects
    #     return render(request, 'editor/company_organizations.html', context)
    # else:
    #     return redirect('organization:create-orgniz')





##Testing landing page
@csrf_exempt
@xframe_options_exempt
def dashboard_pages(request, **kwargs):
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
        return render(request, 'editor/landing_page12.html', context)


    if user.is_org_leader:
        organizations=Organizationv2.objects.filter(organization_lead=user)
        departments=Project.objects.filter(project_lead=user)
        context={'user_companies':user_companies, 'user_projects':user_projects,'organizations':organizations,'departments':departments, 'user':user, 'company': organizations[0].company}
        return render(request, 'editor/landing_page12.html', context)

    if user.is_project_leader:
        departments=Project.objects.filter(project_lead=user) #user is project lead
        context={'departments':departments,'user_companies':user_companies,'user_projects':user_projects, 'user':user, 'company': user_projects[0].organization.company}
        return render(request, 'editor/landing_page12.html', context)

    else:
        context={'user_companies':user_companies, 'user_projects':user_projects, 'user':user, 'company': user_companies[0]}
        return render(request, 'editor/landing_page12.html', context)

def one_compact(request):
    user = request.user
    return JsonResponse({ 'status': 'ok' , 'admin check': user.is_admin,  'org lead check': user.is_org_leader,  'project lead check': user.is_project_leader })

#   older
@xframe_options_exempt
def homePageView(request, *args, **kwargs):
    org_list = Organizationv2.objects.all()
    is_member = False
    for org in org_list :
        if (request.user in org.staff_members.all()) or (request.user in org.members.all()):
            print(org)
            is_member = True

    if is_member :
        return render(request, 'home.html', {'org_id': org.id})
    else:
        return redirect('organization:create-orgniz')

@xframe_options_exempt
def error(request, *args, **kwargs):
    return render(request, 'pages/error.html', {})