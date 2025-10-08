from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .health_check import SystemHealthCheckService

class HealthCheckView(APIView):
    """View for system health check"""
    
    def get(self, request):
        """Run health check and return results"""
        health_service = SystemHealthCheckService()
        results = health_service.run_health_check()
        
        status_code = status.HTTP_200_OK if results['overall_healthy'] else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(results, status=status_code)

class SystemStatisticsView(APIView):
    """View for system statistics"""
    
    def get(self, request):
        """Get system statistics"""
        health_service = SystemHealthCheckService()
        stats = health_service.get_system_statistics()
        return Response(stats)