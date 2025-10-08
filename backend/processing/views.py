from rest_framework import viewsets, permissions
from .models import EmailAccount, EmailRule, Workflow, WorkflowStep
from .serializers import EmailAccountSerializer, EmailRuleSerializer, WorkflowSerializer, WorkflowStepSerializer

class EmailAccountViewSet(viewsets.ModelViewSet):
    queryset = EmailAccount.objects.all()
    serializer_class = EmailAccountSerializer
    permission_classes = [permissions.AllowAny]

class EmailRuleViewSet(viewsets.ModelViewSet):
    queryset = EmailRule.objects.all()
    serializer_class = EmailRuleSerializer
    permission_classes = [permissions.AllowAny]

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [permissions.AllowAny]

class WorkflowStepViewSet(viewsets.ModelViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [permissions.AllowAny]