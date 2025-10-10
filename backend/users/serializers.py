from rest_framework import serializers
from .models import CustomUser, Department

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    """
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'role', 
            'department', 'is_active', 'is_staff', 'date_joined', 'last_login',
            'mfa_enabled', 'middle_name', 'suffix', 'address', 'phone_number',
            'job_title', 'employee_id', 'start_date', 'manager', 'timezone',
            'locale', 'profile_picture'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Department model.
    """
    
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'description', 'parent_department', 'created_at',
            'updated_at', 'is_active', 'owner'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']