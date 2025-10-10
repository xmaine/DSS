from django.db import models
from users.models import CustomUser
from documents.models import Document, DocumentVersion
from django.contrib.auth.models import Group

User = CustomUser

class WorkflowTemplate(models.Model):
    """Model representing a reusable workflow template."""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class WorkflowStep(models.Model):
    """Model representing an individual step within a workflow template."""
    
    workflow_template = models.ForeignKey(WorkflowTemplate, on_delete=models.CASCADE)
    step_order = models.SmallIntegerField()  # Order of execution (e.g., 1, 2, 3)
    name = models.CharField(max_length=255)  # e.g., "Review", "Approve", "Fact Check"
    description = models.TextField(blank=True, null=True)
    assigned_role = models.CharField(max_length=20, blank=True, null=True)  # Role responsible for this step
    assigned_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Specific user for this step
    REQUIRED_ACTIONS = [
        ('APPROVE', 'APPROVE'),
        ('EDIT', 'EDIT'),
        ('VIEW_AND_COMMENT', 'VIEW_AND_COMMENT'),
    ]
    required_action = models.CharField(max_length=50, choices=REQUIRED_ACTIONS)
    duration_days = models.IntegerField(null=True, blank=True)  # Expected duration for the step
    
    def __str__(self):
        return f"{self.workflow_template.name} - Step {self.step_order}: {self.name}"

class WorkflowInstance(models.Model):
    """Model representing a live running instance of a workflow for a specific document."""
    
    workflow_template = models.ForeignKey(WorkflowTemplate, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    initiated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    current_step = models.ForeignKey(WorkflowStep, on_delete=models.SET_NULL, null=True, blank=True)
    STATUSES = [
        ('PENDING', 'PENDING'),
        ('IN_PROGRESS', 'IN_PROGRESS'),
        ('COMPLETED', 'COMPLETED'),
        ('REJECTED', 'REJECTED'),
        ('CANCELLED', 'CANCELLED'),
    ]
    status = models.CharField(max_length=20, choices=STATUSES)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Workflow {self.workflow_template.name} for {self.document.name}"

class WorkflowTask(models.Model):
    """Model representing individual task entries for users within a workflow instance."""
    
    workflow_instance = models.ForeignKey(WorkflowInstance, on_delete=models.CASCADE)
    workflow_step = models.ForeignKey(WorkflowStep, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    STATUSES = [
        ('PENDING', 'PENDING'),
        ('COMPLETED', 'COMPLETED'),
        ('REJECTED', 'REJECTED'),
        ('SKIPPED', 'SKIPPED'),
    ]
    status = models.CharField(max_length=20, choices=STATUSES)
    ACTION_CHOICES = [
        ('APPROVED', 'APPROVED'),
        ('REJECTED_WITH_COMMENT', 'REJECTED_WITH_COMMENT'),
        ('EDITED', 'EDITED'),
    ]
    action_taken = models.CharField(max_length=50, choices=ACTION_CHOICES, null=True, blank=True)
    comment = models.TextField(blank=True, null=True)  # Comments made by the user on completing the task
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Task {self.workflow_step.name} for {self.assigned_to.username}"