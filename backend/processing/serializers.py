from rest_framework import serializers
from .models import EmailAccount, EmailRule, Workflow, WorkflowStep
from documents.serializers import TagSerializer, CorrespondentSerializer, DocumentTypeSerializer

class EmailAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAccount
        fields = '__all__'

class EmailRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailRule
        fields = '__all__'

class WorkflowStepSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)
    
    class Meta:
        model = WorkflowStep
        fields = '__all__'

class WorkflowSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = Workflow
        fields = '__all__'