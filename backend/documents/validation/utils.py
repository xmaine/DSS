from typing import Any, Dict, Optional
from pydantic import ValidationError
from rest_framework.response import Response
from rest_framework import status

def validate_data(model_class: Any, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Validate data using a Pydantic model.
    
    Args:
        model_class: The Pydantic model class to use for validation.
        data: The data to validate.
        
    Returns:
        dict: Validated data if successful, None if validation failed.
    """
    try:
        validated_data = model_class(**data)
        return validated_data.dict(exclude_unset=True)
    except ValidationError as e:
        return None

def get_validation_error_response(model_class: Any, data: Dict[str, Any]) -> Response:
    """
    Get a validation error response for invalid data.
    
    Args:
        model_class: The Pydantic model class used for validation.
        data: The data that failed validation.
        
    Returns:
        Response: DRF Response with validation errors.
    """
    try:
        model_class(**data)
        # If no exception was raised, return a generic error
        return Response(
            {'error': 'Validation failed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except ValidationError as e:
        return Response(
            {'error': 'Validation failed', 'details': e.errors()}, 
            status=status.HTTP_400_BAD_REQUEST
        )