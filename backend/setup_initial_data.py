#!/usr/bin/env python
"""
Script to set up initial data for the Document Solutions system.
This includes creating the initial users, departments, and sample data.
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from documents.models import Document, DocumentType, Correspondent, Tag, Folder
from processing.models import WorkflowTemplate, WorkflowStep

def create_initial_users():
    """Create the initial users as specified."""
    print("Creating initial users...")
    
    # System Administrator
    sys_admin, created = CustomUser.objects.get_or_create(
        username='sysadmins',
        defaults={
            'role': 'ADMIN',
            'is_staff': True,
            'is_superuser': True,
            'first_name': 'System',
            'last_name': 'Administrator',
            'email': 'sysadmin@documentsolutions.com'
        }
    )
    if created:
        sys_admin.set_password('maineroot')
        sys_admin.save()
        print("  - Created System Administrator: sysadmins")
    else:
        print("  - System Administrator already exists")
    
    # Senior Department Head
    senior_dept_head, created = CustomUser.objects.get_or_create(
        username='seniordepthd',
        defaults={
            'role': 'SENIOR_DEPT_HEAD',
            'is_staff': True,
            'first_name': 'Senior',
            'last_name': 'Dept Head',
            'email': 'senior.dept.head@documentsolutions.com'
        }
    )
    if created:
        senior_dept_head.set_password('testing')
        senior_dept_head.save()
        print("  - Created Senior Department Head: seniordepthd")
    else:
        print("  - Senior Department Head already exists")
    
    # Department Head
    dept_head, created = CustomUser.objects.get_or_create(
        username='depthd',
        defaults={
            'role': 'DEPT_HEAD',
            'is_staff': False,
            'first_name': 'Department',
            'last_name': 'Head',
            'email': 'dept.head@documentsolutions.com'
        }
    )
    if created:
        dept_head.set_password('testing')
        dept_head.save()
        print("  - Created Department Head: depthd")
    else:
        print("  - Department Head already exists")
    
    # Employee
    employee, created = CustomUser.objects.get_or_create(
        username='emponly',
        defaults={
            'role': 'EMPLOYEE',
            'is_staff': False,
            'first_name': 'Regular',
            'last_name': 'Employee',
            'email': 'employee@documentsolutions.com'
        }
    )
    if created:
        employee.set_password('testing')
        employee.save()
        print("  - Created Employee: emponly")
    else:
        print("  - Employee already exists")

def create_departments():
    """Create sample departments - only Finance and Publication as requested."""
    print("Creating sample departments...")
    
    # Assign Finance department to some users
    CustomUser.objects.filter(username__in=['seniordepthd', 'depthd']).update(department='Finance')
    print("  - Assigned Finance department to seniordepthd and depthd")
    
    # Assign Publication department to other users
    CustomUser.objects.filter(username='emponly').update(department='Publication')
    print("  - Assigned Publication department to emponly")

def create_sample_document_types():
    """Create sample document types."""
    print("Creating sample document types...")
    
    doc_types = ['Invoice', 'Contract', 'Memo', 'Report', 'Letter']
    for doc_type in doc_types:
        obj, created = DocumentType.objects.get_or_create(name=doc_type)
        if created:
            print(f"  - Created Document Type: {doc_type}")
        else:
            print(f"  - Document Type already exists: {doc_type}")

def create_sample_correspondents():
    """Create sample correspondents."""
    print("Creating sample correspondents...")
    
    correspondents = [
        ('ABC Corporation', 'A major business partner'),
        ('XYZ Suppliers', 'Primary supplier for office supplies'),
        ('Internal Memo', 'Internal company communications'),
        ('Finance Department', 'Company finance department'),
        ('HR Department', 'Human resources department')
    ]
    
    for name, description in correspondents:
        obj, created = Correspondent.objects.get_or_create(
            name=name,
            defaults={'description': description}
        )
        if created:
            print(f"  - Created Correspondent: {name}")
        else:
            print(f"  - Correspondent already exists: {name}")

def create_sample_tags():
    """Create sample tags."""
    print("Creating sample tags...")
    
    tags = [
        ('Finance',),
        ('Urgent',),
        ('Approved',),
        ('Review',),
        ('Confidential',)
    ]
    
    for name, in tags:
        obj, created = Tag.objects.get_or_create(name=name)
        if created:
            print(f"  - Created Tag: {name}")
        else:
            print(f"  - Tag already exists: {name}")

def create_sample_folders():
    """Create sample folders."""
    print("Creating sample folders...")
    
    # Get users for folder ownership
    try:
        admin_user = CustomUser.objects.get(username='sysadmins')
        dept_head_user = CustomUser.objects.get(username='depthd')
    except CustomUser.DoesNotExist:
        print("  - Required users not found. Skipping folder creation.")
        return
    
    # Root folders for each department
    finance_folder, created = Folder.objects.get_or_create(
        name='Finance Documents',
        owner=admin_user,
        path='/Finance Documents',
        defaults={'is_active': True}
    )
    if created:
        print("  - Created Finance Documents folder")
    
    publication_folder, created = Folder.objects.get_or_create(
        name='Publication Documents',
        owner=admin_user,
        path='/Publication Documents',
        defaults={'is_active': True}
    )
    if created:
        print("  - Created Publication Documents folder")
    
    # Subfolders
    subfolders = [
        ('Financial Reports', finance_folder, admin_user, '/Finance Documents/Financial Reports'),
        ('Vendor Contracts', finance_folder, admin_user, '/Finance Documents/Vendor Contracts'),
        ('Marketing Materials', publication_folder, dept_head_user, '/Publication Documents/Marketing Materials'),
        ('Press Releases', publication_folder, dept_head_user, '/Publication Documents/Press Releases')
    ]
    
    for name, parent, owner, path in subfolders:
        folder, created = Folder.objects.get_or_create(
            name=name,
            parent_folder=parent,
            owner=owner,
            path=path,
            defaults={'is_active': True}
        )
        if created:
            print(f"  - Created folder: {name}")

def create_sample_documents():
    """Create sample documents for testing - only two as requested."""
    print("Creating sample documents...")
    
    # Get users for document ownership
    try:
        admin_user = CustomUser.objects.get(username='sysadmins')
        dept_head_user = CustomUser.objects.get(username='depthd')
    except CustomUser.DoesNotExist:
        print("  - Required users not found. Skipping document creation.")
        return
    
    # Get folders
    try:
        finance_folder = Folder.objects.get(name='Finance Documents')
        publication_folder = Folder.objects.get(name='Publication Documents')
    except Folder.DoesNotExist:
        print("  - Required folders not found. Skipping document creation.")
        return
    
    # Get document types and correspondents
    try:
        report_type = DocumentType.objects.get(name='Report')
        contract_type = DocumentType.objects.get(name='Contract')
        finance_correspondent = Correspondent.objects.get(name='Finance Department')
        abc_correspondent = Correspondent.objects.get(name='ABC Corporation')
    except (DocumentType.DoesNotExist, Correspondent.DoesNotExist):
        print("  - Required document types or correspondents not found. Skipping document creation.")
        return
    
    # Sample documents - only two as requested
    documents = [
        {
            'name': 'Q3 Financial Report',
            'description': 'Quarterly financial report for Q3 2025',
            'uploader': admin_user,
            'folder': finance_folder,
            'document_type': report_type,
            'correspondent': finance_correspondent,
        },
        {
            'name': 'New Vendor Contract',
            'description': 'Contract with new software vendor for document management system',
            'uploader': dept_head_user,
            'folder': publication_folder,
            'document_type': contract_type,
            'correspondent': abc_correspondent,
        }
    ]
    
    for doc_data in documents:
        doc, created = Document.objects.get_or_create(
            name=doc_data['name'],
            defaults={
                'description': doc_data['description'],
                'uploader': doc_data['uploader'],
                'folder': doc_data['folder'],
                'document_type': doc_data['document_type'],
                'correspondent': doc_data['correspondent'],
                'is_active': True
            }
        )
        
        if created:
            print(f"  - Created Document: {doc_data['name']}")
        else:
            print(f"  - Document already exists: {doc_data['name']}")

def create_sample_workflows():
    """Create sample workflows."""
    print("Creating sample workflows...")
    
    # Get admin user
    try:
        admin_user = CustomUser.objects.get(username='sysadmins')
    except CustomUser.DoesNotExist:
        print("  - Admin user not found. Skipping workflow creation.")
        return
    
    workflows = [
        {
            'name': 'Document Approval',
            'description': 'Standard workflow for document approval process',
            'created_by': admin_user,
            'is_active': True
        },
        {
            'name': 'Invoice Processing',
            'description': 'Workflow for processing vendor invoices',
            'created_by': admin_user,
            'is_active': True
        }
    ]
    
    for wf_data in workflows:
        wf, created = WorkflowTemplate.objects.get_or_create(
            name=wf_data['name'],
            defaults={
                'description': wf_data['description'],
                'created_by': wf_data['created_by'],
                'is_active': wf_data['is_active']
            }
        )
        if created:
            print(f"  - Created Workflow: {wf_data['name']}")
        else:
            print(f"  - Workflow already exists: {wf_data['name']}")

def main():
    """Main function to set up all initial data."""
    print("Setting up initial data for Document Solutions...")
    print("=" * 50)
    
    create_initial_users()
    print()
    
    create_departments()
    print()
    
    create_sample_document_types()
    print()
    
    create_sample_correspondents()
    print()
    
    create_sample_tags()
    print()
    
    create_sample_folders()
    print()
    
    create_sample_documents()
    print()
    
    create_sample_workflows()
    print()
    
    print("=" * 50)
    print("Initial data setup completed successfully!")

if __name__ == '__main__':
    main()