from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
	age = models.PositiveIntegerField(null=True, blank=True)
	is_staff = models.BooleanField(default=False, blank=False)
	is_org_leader = models.BooleanField(default=False, blank=False)
	is_project_leader= models.BooleanField(default=False, blank=False)

	#def __str__(self):
	 #   return str(self.email)+"-"+str(self.username)+"-"+str(self.age)



###Defining Users Rights
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class User(CustomUser):
    class Types(models.TextChoices):
        ADMIN = "ADMIN", "admin"
        PROJECTLEAD = "PROJECTLEAD", "projectlead"
        MEMBER = "MEMBER", "member"
        OTHER = "OTHER", "other"

    base_type = Types.MEMBER

    type = models.CharField(_("Type"), max_length=50, choices=Types.choices, default=base_type)

    name = models.CharField(_("Name of User"), blank=True, max_length=255)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def save(self, *args, **kwargs):
        if not self.id:
            self.type = self.base_type
        return super().save(*args, **kwargs)


class AdminManager(models.Manager): #all superusers
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.ADMIN)

class ProjectLeadManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.PROJECTLEAD)

class MemberManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.MEMBER)

class OthersManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.OTHER)


class Admin(User):
    base_type = User.Types.ADMIN
    objects = AdminManager()

    class Meta:
        proxy = True

    def rights(self):
        return "all_rights"


class ProjectLead(User):
    base_type = User.Types.PROJECTLEAD
    objects = ProjectLeadManager()

    class Meta:
        proxy = True

    def add_members(self):
        return "can add members"

class member(User):
    base_type = User.Types.MEMBER
    objects = MemberManager()

    class Meta:
        proxy = True

    def view_and_sign(self):
        return "can view and sign"

class Other_user():
    base_type = User.Types.OTHER
    objects = OthersManager()

    class Meta:
        proxy = True

    def can_sign(self):
        return "can only sign"
"""