import pytest
from unittest.mock import patch, MagicMock
from django.contrib.auth.models import User
from documents.models import Document, Tag, Correspondent, DocumentType
from processing.workflow_service import WorkflowService
from processing.models import Workflow, WorkflowStep

@pytest.mark.django_db
class TestWorkflowService:
    """Test cases for WorkflowService"""
    
    def test_process_workflows_no_workflows(self):
        """Test processing workflows when no workflows exist"""
        document = Document.objects.create(title="Test Document")
        
        workflow_service = WorkflowService()
        # Should not raise any exceptions
        workflow_service.process_workflows(document.id)
    
    def test_step_conditions_match_document_type(self):
        """Test that step conditions match document type"""
        workflow = Workflow.objects.create(name="Test Workflow")
        doc_type = DocumentType.objects.create(name="Invoice")
        document = Document.objects.create(
            title="Test Document",
            document_type=doc_type
        )
        
        # Create a workflow step that requires the Invoice document type
        step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            document_type=doc_type,
            action="tag",
            action_value="Processed"
        )
        
        workflow_service = WorkflowService()
        result = workflow_service._step_conditions_match(step, document)
        
        assert result == True
    
    def test_step_conditions_no_match_document_type(self):
        """Test that step conditions don't match different document type"""
        workflow = Workflow.objects.create(name="Test Workflow")
        doc_type1 = DocumentType.objects.create(name="Invoice")
        doc_type2 = DocumentType.objects.create(name="Contract")
        document = Document.objects.create(
            title="Test Document",
            document_type=doc_type1
        )
        
        # Create a workflow step that requires a different document type
        step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            document_type=doc_type2,
            action="tag",
            action_value="Processed"
        )
        
        workflow_service = WorkflowService()
        result = workflow_service._step_conditions_match(step, document)
        
        assert result == False
    
    def test_step_conditions_match_tags(self):
        """Test that step conditions match document tags"""
        workflow = Workflow.objects.create(name="Test Workflow")
        tag = Tag.objects.create(name="Important")
        document = Document.objects.create(title="Test Document")
        document.tags.add(tag)
        
        # Create a workflow step that requires the Important tag
        step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            action="tag",
            action_value="Processed"
        )
        step.tags.add(tag)
        
        workflow_service = WorkflowService()
        result = workflow_service._step_conditions_match(step, document)
        
        assert result == True
    
    def test_apply_step_action_tag(self):
        """Test applying a tag action in a workflow step"""
        workflow = Workflow.objects.create(name="Test Workflow")
        document = Document.objects.create(title="Test Document")
        
        step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            action="tag",
            action_value="Processed"
        )
        
        workflow_service = WorkflowService()
        workflow_service._apply_step_action(step, document)
        
        # Check that the tag was added to the document
        document.refresh_from_db()
        tag = Tag.objects.get(name="Processed")
        assert tag in document.tags.all()
    
    def test_apply_step_action_document_type(self):
        """Test applying a document type action in a workflow step"""
        workflow = Workflow.objects.create(name="Test Workflow")
        document = Document.objects.create(title="Test Document")
        doc_type = DocumentType.objects.create(name="Invoice")
        
        step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            action="doctype",
            action_value="Invoice"
        )
        
        workflow_service = WorkflowService()
        workflow_service._apply_step_action(step, document)
        
        # Check that the document type was set
        document.refresh_from_db()
        assert document.document_type == doc_type