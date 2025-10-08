from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class EmailAccountCreate(BaseModel):
    """Pydantic model for creating an email account."""
    name: str = Field(..., min_length=1, max_length=100)
    email_address: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    imap_server: str = Field(..., min_length=1, max_length=255)
    imap_port: int = Field(993, ge=1, le=65535)
    username: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=1)
    use_ssl: bool = True
    active: bool = True

class EmailAccountUpdate(BaseModel):
    """Pydantic model for updating an email account."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email_address: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    imap_server: Optional[str] = Field(None, min_length=1, max_length=255)
    imap_port: Optional[int] = Field(None, ge=1, le=65535)
    username: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=1)
    use_ssl: Optional[bool] = None
    active: Optional[bool] = None

class EmailRuleCreate(BaseModel):
    """Pydantic model for creating an email rule."""
    email_account_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1, max_length=100)
    order: int = Field(0, ge=0)
    subject_contains: Optional[str] = Field(None, max_length=255)
    sender_contains: Optional[str] = Field(None, max_length=255)
    body_contains: Optional[str] = Field(None, max_length=255)
    action: str = Field(..., pattern=r'^(tag|correspondent|doctype|delete|move)$')
    action_value: Optional[str] = Field(None, max_length=255)

class EmailRuleUpdate(BaseModel):
    """Pydantic model for updating an email rule."""
    email_account_id: Optional[int] = Field(None, gt=0)
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    order: Optional[int] = Field(None, ge=0)
    subject_contains: Optional[str] = Field(None, max_length=255)
    sender_contains: Optional[str] = Field(None, max_length=255)
    body_contains: Optional[str] = Field(None, max_length=255)
    action: Optional[str] = Field(None, pattern=r'^(tag|correspondent|doctype|delete|move)$')
    action_value: Optional[str] = Field(None, max_length=255)

class WorkflowCreate(BaseModel):
    """Pydantic model for creating a workflow."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    active: bool = True

class WorkflowUpdate(BaseModel):
    """Pydantic model for updating a workflow."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    active: Optional[bool] = None

class WorkflowStepCreate(BaseModel):
    """Pydantic model for creating a workflow step."""
    workflow_id: int = Field(..., gt=0)
    order: int = Field(..., ge=0)
    name: str = Field(..., min_length=1, max_length=100)
    document_type_id: Optional[int] = Field(None, gt=0)
    action: str = Field(..., pattern=r'^(tag|correspondent|doctype|notify|archive)$')
    action_value: Optional[str] = Field(None, max_length=255)

class WorkflowStepUpdate(BaseModel):
    """Pydantic model for updating a workflow step."""
    workflow_id: Optional[int] = Field(None, gt=0)
    order: Optional[int] = Field(None, ge=0)
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    document_type_id: Optional[int] = Field(None, gt=0)
    action: Optional[str] = Field(None, pattern=r'^(tag|correspondent|doctype|notify|archive)$')
    action_value: Optional[str] = Field(None, max_length=255)