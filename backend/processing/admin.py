from django.contrib import admin
from .models import EmailAccount, EmailRule, Workflow, WorkflowStep

@admin.register(EmailAccount)
class EmailAccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'email_address', 'active', 'last_checked')
    list_filter = ('active', 'last_checked')
    search_fields = ('name', 'email_address')

@admin.register(EmailRule)
class EmailRuleAdmin(admin.ModelAdmin):
    list_display = ('email_account', 'name', 'action')
    list_filter = ('email_account', 'action')
    search_fields = ('name', 'subject_contains', 'sender_contains')

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ('name', 'active', 'created_at')
    list_filter = ('active', 'created_at')
    search_fields = ('name', 'description')

@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'order', 'name', 'action')
    list_filter = ('workflow', 'action')
    search_fields = ('name',)