from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser to include role and department fields.
    """
    
    ROLE_CHOICES = [
        ('ADMIN', 'ADMIN'),
        ('SENIOR_DEPT_HEAD', 'SENIOR_DEPT_HEAD'),
        ('DEPT_HEAD', 'DEPT_HEAD'),
        ('EMPLOYEE', 'EMPLOYEE'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='EMPLOYEE',
        help_text='User role determining permissions and access levels'
    )
    
    department = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Department the user belongs to'
    )
    
    mfa_enabled = models.BooleanField(
        default=False,
        help_text='Indicates if 2FA is enabled for this user'
    )
    
    # Additional profile fields
    middle_name = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text='User middle name'
    )
    
    suffix = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text='User suffix (e.g., Jr., Sr., III)'
    )
    
    address = models.TextField(
        blank=True,
        null=True,
        help_text='User address'
    )
    
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='User phone number'
    )
    
    job_title = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='User job title'
    )
    
    employee_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='User employee ID'
    )
    
    start_date = models.DateField(
        blank=True,
        null=True,
        help_text='User start date'
    )
    
    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text='User manager'
    )
    
    timezone = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='User timezone'
    )
    
    locale = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text='User locale'
    )
    
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        help_text='User profile picture'
    )
    
    def __str__(self):
        """
        Return a string representation of the user.
        
        Returns:
            str: The username of the user.
        """
        return self.username


class Department(models.Model):
    """
    Department model to represent organizational departments.
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Department name'
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text='Department description'
    )
    
    parent_department = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text='Parent department for hierarchical structure'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Department creation timestamp'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Department last update timestamp'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Indicates if department is active'
    )
    
    owner = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text='Department owner/head',
        related_name='owned_departments'  # Add related_name to avoid conflict
    )
    
    def __str__(self):
        """
        Return a string representation of the department.
        
        Returns:
            str: The name of the department.
        """
        return self.name
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'