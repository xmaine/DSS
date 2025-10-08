from pydantic import BaseModel, Field, validator
from typing import Optional, List, Union
from datetime import datetime
from enum import Enum

class DocumentStatus(str, Enum):
    """Enumeration of possible document statuses."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class TagCreate(BaseModel):
    """Pydantic model for creating a tag."""
    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field("#000000", pattern=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')

class TagUpdate(BaseModel):
    """Pydantic model for updating a tag."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, pattern=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')

class CorrespondentCreate(BaseModel):
    """Pydantic model for creating a correspondent."""
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')

class CorrespondentUpdate(BaseModel):
    """Pydantic model for updating a correspondent."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')

class DocumentTypeCreate(BaseModel):
    """Pydantic model for creating a document type."""
    name: str = Field(..., min_length=1, max_length=100)

class DocumentTypeUpdate(BaseModel):
    """Pydantic model for updating a document type."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)

class DocumentCreate(BaseModel):
    """Pydantic model for creating a document."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    file: str = Field(..., min_length=1)
    original_filename: Optional[str] = Field(None, max_length=255)
    file_size: Optional[int] = Field(None, gt=0)
    mime_type: Optional[str] = Field(None, max_length=100)

class DocumentUpdate(BaseModel):
    """Pydantic model for updating a document."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    original_filename: Optional[str] = Field(None, max_length=255)
    file_size: Optional[int] = Field(None, gt=0)
    mime_type: Optional[str] = Field(None, max_length=100)
    archived: Optional[bool] = None

class DocumentSearch(BaseModel):
    """Pydantic model for document search parameters."""
    query: str = Field("", max_length=255)
    tags: Optional[List[str]] = None
    correspondent: Optional[str] = None
    document_type: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

class DocumentPermissionCreate(BaseModel):
    """Pydantic model for creating a document permission."""
    document_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    permission_level: str = Field(..., pattern=r'^(view|edit|manage)$')

class DocumentPermissionUpdate(BaseModel):
    """Pydantic model for updating a document permission."""
    permission_level: Optional[str] = Field(None, pattern=r'^(view|edit|manage)$')

class SharedLinkCreate(BaseModel):
    """Pydantic model for creating a shared link."""
    document_id: int = Field(..., gt=0)
    expires_at: Optional[datetime] = None
    is_active: bool = True

class SharedLinkUpdate(BaseModel):
    """Pydantic model for updating a shared link."""
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None

# Validators
@validator('file')
def validate_file_extension(cls, v):
    """Validate that the file has a valid extension."""
    valid_extensions = {'.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
    if not any(v.lower().endswith(ext) for ext in valid_extensions):
        raise ValueError('File must have a valid extension')
    return v

@validator('date_to')
def validate_date_range(cls, v, values):
    """Validate that date_to is after date_from."""
    if 'date_from' in values and values['date_from'] and v and v < values['date_from']:
        raise ValueError('date_to must be after date_from')
    return v