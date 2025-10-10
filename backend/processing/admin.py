from django.contrib import admin
from .models import WorkflowTemplate, WorkflowStep

@admin.register(WorkflowTemplate)
class WorkflowTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')

@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = ('workflow_template', 'step_order', 'name', 'required_action')
    list_filter = ('workflow_template', 'required_action')
    search_fields = ('name',)