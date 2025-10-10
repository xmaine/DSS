from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Department
from django.utils import timezone

class Command(BaseCommand):
    help = 'Set up sample users and departments for Document Solutions'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Create departments
        finance_dept, created = Department.objects.get_or_create(
            name='Finance',
            defaults={
                'description': 'Finance Department',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(f'Created department: {finance_dept.name}')
        else:
            self.stdout.write(f'Department already exists: {finance_dept.name}')

        publication_dept, created = Department.objects.get_or_create(
            name='Publication',
            defaults={
                'description': 'Publication Department',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(f'Created department: {publication_dept.name}')
        else:
            self.stdout.write(f'Department already exists: {publication_dept.name}')

        # Create System Administrator
        sysadmin_user, created = User.objects.get_or_create(
            username='sysadmins',
            defaults={
                'first_name': 'System',
                'last_name': 'Administrator',
                'email': 'sysadmin@documentsolutions.com',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
                'date_joined': timezone.now(),
                'job_title': 'System Administrator',
                'employee_id': 'EMP001',
                'timezone': 'America/New_York',
                'locale': 'en-US',
                'phone_number': '+1-555-0101',
                'address': '123 Admin St, New York, NY 10001',
                'middle_name': 'Admin',
                'suffix': 'Sr.',
                'start_date': timezone.now().date(),
            }
        )
        if created:
            sysadmin_user.set_password('maineroot')
            sysadmin_user.save()
            self.stdout.write(self.style.SUCCESS('Successfully created System Administrator user "sysadmins"'))
        else:
            # Update existing user with complete information
            sysadmin_user.first_name = 'System'
            sysadmin_user.last_name = 'Administrator'
            sysadmin_user.email = 'sysadmin@documentsolutions.com'
            sysadmin_user.role = 'ADMIN'
            sysadmin_user.is_staff = True
            sysadmin_user.is_superuser = True
            sysadmin_user.is_active = True
            sysadmin_user.job_title = 'System Administrator'
            sysadmin_user.employee_id = 'EMP001'
            sysadmin_user.timezone = 'America/New_York'
            sysadmin_user.locale = 'en-US'
            sysadmin_user.phone_number = '+1-555-0101'
            sysadmin_user.address = '123 Admin St, New York, NY 10001'
            sysadmin_user.middle_name = 'Admin'
            sysadmin_user.suffix = 'Sr.'
            sysadmin_user.start_date = timezone.now().date()
            sysadmin_user.set_password('maineroot')
            sysadmin_user.save()
            self.stdout.write('Updated System Administrator user "sysadmins" with complete information')

        # Create Senior Department Head
        senior_dept_head, created = User.objects.get_or_create(
            username='seniordepthd',
            defaults={
                'first_name': 'Senior',
                'last_name': 'Department Head',
                'email': 'senior.dept.head@documentsolutions.com',
                'role': 'SENIOR_DEPT_HEAD',
                'department': 'Finance',
                'is_staff': True,
                'is_superuser': False,
                'is_active': True,
                'date_joined': timezone.now(),
                'job_title': 'Senior Department Head',
                'employee_id': 'EMP002',
                'timezone': 'America/New_York',
                'locale': 'en-US',
                'phone_number': '+1-555-0102',
                'address': '456 Senior St, New York, NY 10002',
                'middle_name': 'Dept',
                'suffix': 'Jr.',
                'start_date': timezone.now().date(),
            }
        )
        if created:
            senior_dept_head.set_password('testing')
            senior_dept_head.save()
            self.stdout.write(self.style.SUCCESS('Successfully created Senior Department Head user "seniordepthd"'))
        else:
            # Update existing user with complete information
            senior_dept_head.first_name = 'Senior'
            senior_dept_head.last_name = 'Department Head'
            senior_dept_head.email = 'senior.dept.head@documentsolutions.com'
            senior_dept_head.role = 'SENIOR_DEPT_HEAD'
            senior_dept_head.department = 'Finance'
            senior_dept_head.is_staff = True
            senior_dept_head.is_superuser = False
            senior_dept_head.is_active = True
            senior_dept_head.job_title = 'Senior Department Head'
            senior_dept_head.employee_id = 'EMP002'
            senior_dept_head.timezone = 'America/New_York'
            senior_dept_head.locale = 'en-US'
            senior_dept_head.phone_number = '+1-555-0102'
            senior_dept_head.address = '456 Senior St, New York, NY 10002'
            senior_dept_head.middle_name = 'Dept'
            senior_dept_head.suffix = 'Jr.'
            senior_dept_head.start_date = timezone.now().date()
            senior_dept_head.set_password('testing')
            senior_dept_head.save()
            self.stdout.write('Updated Senior Department Head user "seniordepthd" with complete information')

        # Create Department Head
        dept_head, created = User.objects.get_or_create(
            username='depthd',
            defaults={
                'first_name': 'Department',
                'last_name': 'Head',
                'email': 'dept.head@documentsolutions.com',
                'role': 'DEPT_HEAD',
                'department': 'Publication',
                'is_staff': True,
                'is_superuser': False,
                'is_active': True,
                'date_joined': timezone.now(),
                'job_title': 'Department Head',
                'employee_id': 'EMP003',
                'timezone': 'America/New_York',
                'locale': 'en-US',
                'phone_number': '+1-555-0103',
                'address': '789 Head St, New York, NY 10003',
                'middle_name': 'Manager',
                'suffix': 'III',
                'start_date': timezone.now().date(),
            }
        )
        if created:
            dept_head.set_password('testing')
            dept_head.save()
            self.stdout.write(self.style.SUCCESS('Successfully created Department Head user "depthd"'))
        else:
            # Update existing user with complete information
            dept_head.first_name = 'Department'
            dept_head.last_name = 'Head'
            dept_head.email = 'dept.head@documentsolutions.com'
            dept_head.role = 'DEPT_HEAD'
            dept_head.department = 'Publication'
            dept_head.is_staff = True
            dept_head.is_superuser = False
            dept_head.is_active = True
            dept_head.job_title = 'Department Head'
            dept_head.employee_id = 'EMP003'
            dept_head.timezone = 'America/New_York'
            dept_head.locale = 'en-US'
            dept_head.phone_number = '+1-555-0103'
            dept_head.address = '789 Head St, New York, NY 10003'
            dept_head.middle_name = 'Manager'
            dept_head.suffix = 'III'
            dept_head.start_date = timezone.now().date()
            dept_head.set_password('testing')
            dept_head.save()
            self.stdout.write('Updated Department Head user "depthd" with complete information')

        # Create Employee
        employee, created = User.objects.get_or_create(
            username='emponly',
            defaults={
                'first_name': 'Regular',
                'last_name': 'Employee',
                'email': 'employee@documentsolutions.com',
                'role': 'EMPLOYEE',
                'department': 'Publication',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True,
                'date_joined': timezone.now(),
                'job_title': 'Document Specialist',
                'employee_id': 'EMP004',
                'timezone': 'America/New_York',
                'locale': 'en-US',
                'phone_number': '+1-555-0104',
                'address': '1011 Employee St, New York, NY 10004',
                'middle_name': 'Worker',
                'suffix': '',
                'start_date': timezone.now().date(),
            }
        )
        if created:
            employee.set_password('testing')
            employee.save()
            self.stdout.write(self.style.SUCCESS('Successfully created Employee user "emponly"'))
        else:
            # Update existing user with complete information
            employee.first_name = 'Regular'
            employee.last_name = 'Employee'
            employee.email = 'employee@documentsolutions.com'
            employee.role = 'EMPLOYEE'
            employee.department = 'Publication'
            employee.is_staff = False
            employee.is_superuser = False
            employee.is_active = True
            employee.job_title = 'Document Specialist'
            employee.employee_id = 'EMP004'
            employee.timezone = 'America/New_York'
            employee.locale = 'en-US'
            employee.phone_number = '+1-555-0104'
            employee.address = '1011 Employee St, New York, NY 10004'
            employee.middle_name = 'Worker'
            employee.suffix = ''
            employee.start_date = timezone.now().date()
            employee.set_password('testing')
            employee.save()
            self.stdout.write('Updated Employee user "emponly" with complete information')

        # Set department owners
        finance_dept.owner = senior_dept_head
        finance_dept.save()
        self.stdout.write(f'Set {senior_dept_head.username} as owner of {finance_dept.name} department')
        
        publication_dept.owner = dept_head
        publication_dept.save()
        self.stdout.write(f'Set {dept_head.username} as owner of {publication_dept.name} department')

        self.stdout.write(self.style.SUCCESS('Sample data setup completed successfully!'))