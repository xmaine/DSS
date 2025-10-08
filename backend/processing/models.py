from django.db import models
from django.contrib.auth.models import User
from documents.models import Tag, Correspondent, DocumentType

class EmailAccount(models.Model):
    name = models.CharField(max_length=100)
    email_address = models.EmailField()
    imap_server = models.CharField(max_length=255)
    imap_port = models.IntegerField(default=993)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  # In production, use encryption
    use_ssl = models.BooleanField(default=True)
    active = models.BooleanField(default=True)
    last_checked = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.email_address})"

class EmailRule(models.Model):
    RULE_ACTIONS = [
        ('tag', 'Apply Tag'),
        ('correspondent', 'Set Correspondent'),
        ('doctype', 'Set Document Type'),
        ('delete', 'Delete Email'),
        ('move', 'Move to Folder'),
    ]
    
    email_account = models.ForeignKey(EmailAccount, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    
    # Conditions
    subject_contains = models.CharField(max_length=255, blank=True)
    sender_contains = models.CharField(max_length=255, blank=True)
    body_contains = models.CharField(max_length=255, blank=True)
    
    # Actions
    action = models.CharField(max_length=20, choices=RULE_ACTIONS)
    action_value = models.CharField(max_length=255, blank=True)  # For tag, correspondent, etc.
    
    def __str__(self):
        return f"{self.email_account.name}: {self.name}"

class Workflow(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class WorkflowStep(models.Model):
    WORKFLOW_ACTIONS = [
        ('tag', 'Apply Tag'),
        ('correspondent', 'Set Correspondent'),
        ('doctype', 'Set Document Type'),
        ('notify', 'Send Notification'),
        ('archive', 'Archive Document'),
    ]
    
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE)
    order = models.IntegerField()
    name = models.CharField(max_length=100)
    
    # Conditions
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    
    # Action
    action = models.CharField(max_length=20, choices=WORKFLOW_ACTIONS)
    action_value = models.CharField(max_length=255, blank=True)  # For tag, correspondent, etc.
    
    def __str__(self):
        return f"{self.workflow.name}: {self.name}"