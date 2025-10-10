from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WorkflowTemplate, WorkflowStep
from .serializers import WorkflowTemplateSerializer, WorkflowStepSerializer

class WorkflowTemplateViewSet(viewsets.ModelViewSet):
    queryset = WorkflowTemplate.objects.all()
    serializer_class = WorkflowTemplateSerializer
    permission_classes = [permissions.AllowAny]

class WorkflowStepViewSet(viewsets.ModelViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [permissions.AllowAny]

class WorkflowManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for managing workflows from an administrative perspective
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Get all workflow templates"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        workflows = WorkflowTemplate.objects.all()
        serializer = WorkflowTemplateSerializer(workflows, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific workflow template"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            workflow = WorkflowTemplate.objects.get(id=pk)
            serializer = WorkflowTemplateSerializer(workflow)
            return Response(serializer.data)
        except WorkflowTemplate.DoesNotExist:
            return Response({'error': 'Workflow not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='create')
    def create_workflow(self, request):
        """Create a new workflow template"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = WorkflowTemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], url_path='update')
    def update_workflow(self, request, pk=None):
        """Update a workflow template"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            workflow = WorkflowTemplate.objects.get(id=pk)
            serializer = WorkflowTemplateSerializer(workflow, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except WorkflowTemplate.DoesNotExist:
            return Response({'error': 'Workflow not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], url_path='activate')
    def activate_workflow(self, request, pk=None):
        """Activate a workflow template"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            workflow = WorkflowTemplate.objects.get(id=pk)
            workflow.is_active = True
            workflow.save()
            return Response({'message': 'Workflow activated successfully'})
        except WorkflowTemplate.DoesNotExist:
            return Response({'error': 'Workflow not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], url_path='deactivate')
    def deactivate_workflow(self, request, pk=None):
        """Deactivate a workflow template"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            workflow = WorkflowTemplate.objects.get(id=pk)
            workflow.is_active = False
            workflow.save()
            return Response({'message': 'Workflow deactivated successfully'})
        except WorkflowTemplate.DoesNotExist:
            return Response({'error': 'Workflow not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='active-workflows')
    def active_workflows(self, request):
        """Get all active workflow templates"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        workflows = WorkflowTemplate.objects.filter(is_active=True)
        serializer = WorkflowTemplateSerializer(workflows, many=True)
        return Response(serializer.data)