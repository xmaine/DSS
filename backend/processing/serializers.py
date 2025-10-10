from rest_framework import serializers
from .models import WorkflowTemplate, WorkflowStep
from documents.serializers import TagSerializer, DocumentTypeSerializer

class WorkflowStepSerializer(serializers.ModelSerializer):
    # tags = TagSerializer(many=True, read_only=True)
    # document_type = DocumentTypeSerializer(read_only=True)
    
    class Meta:
        model = WorkflowStep
        fields = '__all__'

class WorkflowTemplateSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkflowTemplate
        fields = '__all__'