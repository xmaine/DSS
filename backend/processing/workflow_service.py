from django.utils import timezone
from .models import Workflow, WorkflowStep
from documents.models import Document, Tag, Correspondent, DocumentType
from typing import Optional

class WorkflowService:
    """Service to handle document workflows and automation."""
    
    def process_workflows(self, document_id: int) -> None:
        """
        Process all active workflows for a document.
        
        Args:
            document_id (int): The ID of the document to process workflows for.
        """
        try:
            document = Document.objects.get(id=document_id)
            active_workflows = Workflow.objects.filter(active=True)
            
            for workflow in active_workflows:
                self._process_workflow(workflow, document)
                
        except Document.DoesNotExist:
            print(f"Document with ID {document_id} does not exist")
        except Exception as e:
            print(f"Error processing workflows for document {document_id}: {str(e)}")
    
    def _process_workflow(self, workflow: Workflow, document: Document) -> None:
        """
        Process a single workflow for a document.
        
        Args:
            workflow (Workflow): The workflow to process.
            document (Document): The document to process the workflow for.
        """
        # Get workflow steps ordered by sequence
        steps = WorkflowStep.objects.filter(workflow=workflow).order_by('order')
        
        for step in steps:
            # Check if step conditions match
            if self._step_conditions_match(step, document):
                # Apply step action
                self._apply_step_action(step, document)
    
    def _step_conditions_match(self, step: WorkflowStep, document: Document) -> bool:
        """
        Check if a document matches a workflow step's conditions.
        
        Args:
            step (WorkflowStep): The workflow step to check conditions for.
            document (Document): The document to check against.
            
        Returns:
            bool: True if conditions match, False otherwise.
        """
        # Check document type condition
        if step.document_type and document.document_type != step.document_type:
            return False
        
        # Check tags condition
        if step.tags.exists():
            # Check if document has any of the required tags
            document_tags = set(document.tags.all())
            step_tags = set(step.tags.all())
            if not document_tags.intersection(step_tags):
                return False
        
        return True
    
    def _apply_step_action(self, step: WorkflowStep, document: Document) -> None:
        """
        Apply a workflow step's action to a document.
        
        Args:
            step (WorkflowStep): The workflow step to apply.
            document (Document): The document to apply the action to.
        """
        try:
            if step.action == 'tag':
                # Apply tag
                try:
                    tag = Tag.objects.get(name=step.action_value)
                    document.tags.add(tag)
                except Tag.DoesNotExist:
                    # Create tag if it doesn't exist
                    tag = Tag.objects.create(name=step.action_value)
                    document.tags.add(tag)
            
            elif step.action == 'correspondent':
                # Set correspondent
                try:
                    correspondent = Correspondent.objects.get(name=step.action_value)
                    document.correspondent = correspondent
                except Correspondent.DoesNotExist:
                    # Create correspondent if it doesn't exist
                    correspondent = Correspondent.objects.create(name=step.action_value)
                    document.correspondent = correspondent
            
            elif step.action == 'doctype':
                # Set document type
                try:
                    doc_type = DocumentType.objects.get(name=step.action_value)
                    document.document_type = doc_type
                except DocumentType.DoesNotExist:
                    # Create document type if it doesn't exist
                    doc_type = DocumentType.objects.create(name=step.action_value)
                    document.document_type = doc_type
            
            elif step.action == 'notify':
                # Send notification (simplified implementation)
                self._send_notification(step.action_value, document)
            
            elif step.action == 'archive':
                # Archive document (simplified implementation)
                document.archived = True
            
            # Save document changes
            document.save()
            
        except Exception as e:
            print(f"Error applying workflow step {step.name} to document {document.id}: {str(e)}")
    
    def _send_notification(self, recipient: str, document: Document) -> None:
        """
        Send a notification (simplified implementation).
        
        Args:
            recipient (str): The recipient of the notification.
            document (Document): The document related to the notification.
        """
        # In a real implementation, you would send an email or other notification
        print(f"Notification sent to {recipient} for document {document.title}")