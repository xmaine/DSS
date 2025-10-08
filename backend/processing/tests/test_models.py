import pytest
from django.contrib.auth.models import User
from documents.models import Tag, Correspondent, DocumentType
from processing.models import EmailAccount, EmailRule, Workflow, WorkflowStep

@pytest.mark.django_db
class TestEmailAccountModel:
    """Test cases for EmailAccount model"""
    
    def test_email_account_creation(self):
        """Test creating an email account"""
        email_account = EmailAccount.objects.create(
            name="Test Account",
            email_address="test@example.com",
            imap_server="imap.example.com",
            imap_port=993,
            username="testuser",
            password="testpass",
            use_ssl=True,
            active=True
        )
        assert email_account.name == "Test Account"
        assert email_account.email_address == "test@example.com"
        assert email_account.imap_server == "imap.example.com"
        assert email_account.imap_port == 993
        assert email_account.username == "testuser"
        assert email_account.password == "testpass"
        assert email_account.use_ssl == True
        assert email_account.active == True
    
    def test_email_account_str_representation(self):
        """Test email account string representation"""
        email_account = EmailAccount.objects.create(
            name="Test Account",
            email_address="test@example.com"
        )
        expected_str = "Test Account (test@example.com)"
        assert str(email_account) == expected_str

@pytest.mark.django_db
class TestEmailRuleModel:
    """Test cases for EmailRule model"""
    
    def test_email_rule_creation(self):
        """Test creating an email rule"""
        email_account = EmailAccount.objects.create(
            name="Test Account",
            email_address="test@example.com"
        )
        
        email_rule = EmailRule.objects.create(
            email_account=email_account,
            name="Test Rule",
            order=1,
            subject_contains="Invoice",
            action="tag",
            action_value="Invoice"
        )
        assert email_rule.email_account == email_account
        assert email_rule.name == "Test Rule"
        assert email_rule.order == 1
        assert email_rule.subject_contains == "Invoice"
        assert email_rule.action == "tag"
        assert email_rule.action_value == "Invoice"
    
    def test_email_rule_str_representation(self):
        """Test email rule string representation"""
        email_account = EmailAccount.objects.create(
            name="Test Account",
            email_address="test@example.com"
        )
        
        email_rule = EmailRule.objects.create(
            email_account=email_account,
            name="Test Rule"
        )
        expected_str = "Test Account: Test Rule"
        assert str(email_rule) == expected_str

@pytest.mark.django_db
class TestWorkflowModel:
    """Test cases for Workflow model"""
    
    def test_workflow_creation(self):
        """Test creating a workflow"""
        workflow = Workflow.objects.create(
            name="Test Workflow",
            description="A test workflow",
            active=True
        )
        assert workflow.name == "Test Workflow"
        assert workflow.description == "A test workflow"
        assert workflow.active == True
    
    def test_workflow_str_representation(self):
        """Test workflow string representation"""
        workflow = Workflow.objects.create(name="Test Workflow")
        assert str(workflow) == "Test Workflow"

@pytest.mark.django_db
class TestWorkflowStepModel:
    """Test cases for WorkflowStep model"""
    
    def test_workflow_step_creation(self):
        """Test creating a workflow step"""
        workflow = Workflow.objects.create(name="Test Workflow")
        tag = Tag.objects.create(name="Test Tag")
        doc_type = DocumentType.objects.create(name="Test Doc Type")
        
        workflow_step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step",
            document_type=doc_type,
            action="tag",
            action_value="Processed"
        )
        workflow_step.tags.add(tag)
        
        assert workflow_step.workflow == workflow
        assert workflow_step.order == 1
        assert workflow_step.name == "Test Step"
        assert workflow_step.document_type == doc_type
        assert tag in workflow_step.tags.all()
        assert workflow_step.action == "tag"
        assert workflow_step.action_value == "Processed"
    
    def test_workflow_step_str_representation(self):
        """Test workflow step string representation"""
        workflow = Workflow.objects.create(name="Test Workflow")
        
        workflow_step = WorkflowStep.objects.create(
            workflow=workflow,
            order=1,
            name="Test Step"
        )
        expected_str = "Test Workflow: Test Step"
        assert str(workflow_step) == expected_str