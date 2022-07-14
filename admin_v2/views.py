from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from organizationv2.models import Company
from django.contrib.auth import logout
from .forms import CreateCompanyForm
from django.contrib.sites.models import Site
from organizationv2.models import VerificationToken
import json
from accounts.models import CustomUser
from django.contrib.sites.models import Site
from django.middleware.csrf import _get_new_csrf_token
from django.urls import reverse
from django.core.mail import send_mail
import os

# Create your views here. return redirect('editor:editor', id=doc.id)
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@xframe_options_exempt
def create_company(request):
    form = CreateCompanyForm()
    if request.method == 'POST':
        form = CreateCompanyForm(request.POST, request.FILES)
        try:
            company = get_object_or_404(Company, admin=request.user)# Company.objects.get(admin=request.user)   #

            if company :
                messages.info(request, 'You already have a company.')
                return redirect('admin_v2:dashboard')
        except:
            if form.is_valid():
                user = request.user
                user.is_admin=True
                user.save()
                form.instance.admin = request.user
                form.save()
                messages.info(request, 'You created a company.')
                return redirect('admin_v2:dashboard')
    return render(request, 'admin_v2/create_company.html', { 'form': form})


@csrf_exempt
@xframe_options_exempt
def company_dashboard(request):
    try:
        company = Company.objects.get(admin=request.user)
    except:
        company = None

    if company :
        context = {
            'company': company,
            'is_admin': True,
            'is_org_lead': False,
            'is_project_lead': False,
            'is_member': False,
            'company_logo': os.path.join( Site.objects.get_current().domain , 'media', company.uploaded_company_logo.name)
        }
        return render(request, 'admin_v2/company_dashboard2.html', context)
    else :
        return redirect('pages:error')

#https://100018.pythonanywhere.com/media/logos_company/sign_YFy9Nol.png

@csrf_exempt
@xframe_options_exempt
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

@csrf_exempt
@xframe_options_exempt
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
                token=_get_new_csrf_token())
            token_entry.save()
            route = reverse('admin_v2:verify-user', kwargs={'token': token_entry.token})
            link = Site.objects.get_current().domain + route[1:]
            send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ credentials['email'] + ', password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
            return JsonResponse({ 'status': 'OK', 'message': 'Email sent at ' + token_entry.user_email, 'link': link})
        return JsonResponse({ 'status': 'FAILED', 'message': 'Please provide an email'})

    return JsonResponse({'status': 'FAILED', 'message': 'Must be a post request.'})

@csrf_exempt
@xframe_options_exempt
def formated_mail(instance, email, link):
    return """<link href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css' rel='stylesheet' id='bootstrap-css'>
    <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>
    <!------ Include the above in your HEAD tag ---------->

    <!DOCTYPE html>
    <html>

    <head>
        <title></title>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />

        <style type='text/css'>
            @media screen {
                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                }

                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                }

                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                }

                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                }
            }

            /* CLIENT-SPECIFIC STYLES */
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }

            img {
                -ms-interpolation-mode: bicubic;
            }

            /* RESET STYLES */
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }

            table {
                border-collapse: collapse !important;
            }

            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            /* iOS BLUE LINKS */
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }

            /* MOBILE STYLES */
            @media screen and (max-width:600px) {
                h1 {
                    font-size: 32px !important;
                    line-height: 32px !important;
                }
            }

            /* ANDROID CENTER FIX */
            div[style*='margin: 16px 0;'] {
                margin: 0 !important;
            }
        </style>
    </head>""" + f"""
    <body style='background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;'>
    <!-- HIDDEN PREHEADER TEXT >
    <div style='display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;'></div -->
    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
        <!-- LOGO -->
        <tr>
            <td bgcolor='#21633d' align='center'>
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                    <tr>
                        <td align='center' valign='top' style='padding: 40px 10px 40px 10px;'> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor='#21633d' align='center' style='padding: 0px 10px 0px 10px;'>
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                    <tr>
                        <td bgcolor='#ffffff' align='center' valign='top' style='padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;'>
                            <!-- <h1 style='font-size: 48px; font-weight: 400; margin: 2;'>Don't Leave!</h1> <img src=' https://img.icons8.com/clouds/100/000000/sad.png' width='125' height='120' style='display: block; border: 0px;' /> -->
                             <img src='https://100018.pythonanywhere.com/static/images/doc_logo1.png' width='150' height='150' style='display: block; border: 0px;' /><h2 style='font-size: 36px; font-weight: 400; margin: 2;'>Signature required</h2>


                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                    <tr>
                        <td bgcolor='#ffffff' align='left' style='padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                            <p style='margin: 0 74px; font-size: 16px; color: #000;'>Dear {email},<br>
                                The document sent by DoWell Research is awaiting your signature.
                                To review and sign the document, please click the button below or
                                <a href={link}>
                                Click Here</a> <br><br>
                                </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#ffffff' align='left'>
                            <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                <tr>
                                    <td bgcolor='#ffffff' align='center' style='padding: 20px 30px 60px 30px;'>
                                        <table border='0' cellspacing='0' cellpadding='0'>
                                            <tr>
                                                <td align='center' style='border-radius: 3px;' bgcolor='#21633d'><a href={link} target='_blank' style='font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #fdec00; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #21633d; display: inline-block;'>View Document</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                            <p style='margin: 0 74px; font-size: 16px; color: #000;'>If you have any questions, just reply to this email—we're always happy to help out.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                            <p style='margin: 0 74px; font-size: 16px; color: #000;'> Thank You<br>
                                <br>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f4f4f4' align='center' style='padding: 30px 10px 0px 10px;'>
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                    <tr>
                        <td bgcolor='#FFECD1' align='center' style='padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                            <h2 style='font-size: 20px; font-weight: 400; color: #111111; margin: 0;'>Need more help?</h2>
                            <p style='margin: 0 74px; font-size: 16px; color: #000;'><a href='#' target='_blank' style='color: #21633d;'>We’re here to help you out</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>
                <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                    <tr>
                        <td bgcolor='#f4f4f4' align='left' style='padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;'> <br>
                            <p style='margin: 0 74px; font-size: 16px; color: #000;'>Copyright message <a href='#' target='_blank' style='color: #111111; font-weight: 700;'>dowell @2022</a>.</p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
    </body>

    </html>"""

def test_email(request):














    message = """<link href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css' rel='stylesheet' id='bootstrap-css'>
    <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'></script>/
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>
<!------ Include the above in your HEAD tag ---------->

<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <style type='text/css'>
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*='margin: 16px 0;'] {
            margin: 0 !important;
        }
    </style>
</head>

<body style='background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;'>
<!-- HIDDEN PREHEADER TEXT -->
<div style='display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Times New Roman' ,'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;'> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border='0' cellpadding='0' cellspacing='0' width='100%'>
    <!-- LOGO -->
    <tr>
        <td bgcolor='#21633d' align='center'>
            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                <tr>
                    <td align='center' valign='top' style='padding: 40px 10px 40px 10px;'> </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor='#21633d' align='center' style='padding: 0px 10px 0px 10px;'>
            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                <tr>
                    <td bgcolor='#ffffff' align='center' valign='top' style='padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Times New Roman', Helvetica, Lato, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;'>
                        <!-- <h1 style='font-size: 48px; font-weight: 400; margin: 2;'>Don't Leave!</h1> <img src=' https://img.icons8.com/clouds/100/000000/sad.png' width='125' height='120' style='display: block; border: 0px;' /> -->
                         <img src='https://100018.pythonanywhere.com/static/images/doc_logo1.png' width='350' height='130' style='display: block; border: 0px;' /><h2 style='font-size: 28px; color: #000; font-weight: 400; margin: 2;'>Sign23 Document at DocEdit</h2>


                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>
            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                <tr>
                    <td bgcolor='#ffffff' align='left' style='padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                        <p style='margin: 0 74px; font-size: 18px; color: #000;'>Dear ericmbuthia11@gmail.com,
                            You are invited to join Dowell Research for digital documentations.
                            <br> Kindly click on the link below or button to accept the invitation:<a href='https://100018.pythonanywhere.com/admin_v2/verify-user/b68434-f4feb3c28ca24e157ad09d54db8fc952'>
                            Click Here</a> <br><br>
                            Login to the account using the provided credentials and get back to us if you are facing any issues:<br>
                            <b>Username</b> : ericmbuthia11<br>
                            <b>Password </b>: password123Dowell
                            <br><br>
                            <b> Kindly change the reset the password after you logged in successfully.</b>

                        </p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor='#ffffff' align='left'>
                        <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                            <tr>
                                <td bgcolor='#ffffff' align='center' style='padding: 20px 30px 60px 30px;'>
                                    <table border='0' cellspacing='0' cellpadding='0'>
                                        <tr>
                                            <td align='center' style='border-radius: 3px;' bgcolor='#21633d'><a href='#' target='_blank' style='font-size: 20px; font-family: 'Times New Roman' ,Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #fdec00; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #21633d; display: inline-block;'>Sign Document</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr> <!-- COPY -->
                <tr>
                    <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 20px 30px; color: #666666; font-family: 'Times New Roman' ,Lato , Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                        <p style='margin: 0 74px; font-size: 16px; color: #000;'>If you have any questions, just reply to this email—we're always happy to help out.</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor='#ffffff' align='left' style='padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Times New Roman', Lato, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                        <p style='margin: 0 74px; font-size: 16px; color: #000;'> Regards<br>
                            Dowellresearch<br>
                            UXLivinglab,</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor='#f4f4f4' align='center' style='padding: 30px 10px 0px 10px;'>
            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                <tr>
                    <td bgcolor='#FFECD1' align='center' style='padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Times New Roman', Lato, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>
                        <h2 style='font-size: 20px; font-weight: 400; color: #111111; margin: 0;'>Need more help?</h2>
                        <p style='margin: 0 74px; font-size: 16px; color: #000;'><a href='#' target='_blank' style='color: #21633d;'>We’re here to help you out</a></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>
            <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                <tr>
                    <td bgcolor='#f4f4f4' align='left' style='padding: 0px 30px 30px 30px; color: #666666; font-family: 'Times New Roman' ,Lato , Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;'> <br>
                        <p style="margin: 0 74px; font-size: 16px; color: #000;">Copyright message <a href='#' target='_blank' style='color: #111111; font-weight: 700;'>dowell @2022</a>.</p>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>
</body>

</html>"""
    d = 'https://100018.pythonanywhere.com/admin_v2/verify-user/b68434-f4feb3c28ca24e157ad09d54db8fc952'
    # m = formated_mail("", 'ericmbuthia11@hotmail.com', d )
    # send_mail('You are invited at DocEdit', 'Go at '+ link + ' to accept invitation. If authenticated login by username: '+ credentials['email'] + ', password: "password123Dowell"','', [token_entry.user_email,], fail_silently=False)
    # send_mail('You are invited at DocEdit','Go at  https://100018.pythonanywhere.com/admin_v2/verify-user/b68434-f4feb3c28ca24e157ad09d54db8fc952 to accept invitation. If authenticated login by username: ericmbuthia11, password: "password123Dowell"','',['ericmbuthia11@gmail.com'],fail_silently=False)
    send_mail('You are invited at DocEdit','','',['ericmbuthia11@hotmail.com'],fail_silently=False, html_message=message)
    send_mail('You are invited at DocEdit','','',['ericmbuthia11@gmail.com'],fail_silently=False, html_message=message)
    # send_mail('You are invited at DocEdit','','',['mdashsharma95@gmail.com'],fail_silently=False, html_message=message)
    # send_mail('','',['ericmbuthia11@gmail.com'], fail_silently=False, html_message= formated_mail("", 'ericmbuthia11@gmail.com', d ))
    # send_mail('','',['ericmbuthia11@hotmail.com'], fail_silently=False, html_message= formated_mail("", 'ericmbuthia11@hotmail.com', d ))
    # formated_mail(instance, email, link)
    return JsonResponse({ 'status': 'OK', 'message': 'Email sent at link'})

@csrf_exempt
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




