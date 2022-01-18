from django.shortcuts import render, redirect #, get_object_or_404
from organization.models import Organization

def homePageView(request, *args, **kwargs):
    org_list = Organization.objects.all()
    is_member = False
    for org in org_list :
        if (request.user in org.staff_members.all()) or (request.user in org.members.all()):
            print(org)
            is_member = True

    if is_member :
        return render(request, 'home.html', {'org_id': org.id})
    else:
        return redirect('organization:create-orgniz')


#class HomePageView(TemplateView):
#	template_name = 'home.html'     return render(request, 'home.html', {})
