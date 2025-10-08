from django.core.management.base import BaseCommand
from documents.health_check import SystemHealthCheckService

class Command(BaseCommand):
    help = 'Run system health check'

    def handle(self, *args, **options):
        health_service = SystemHealthCheckService()
        results = health_service.run_health_check()
        
        self.stdout.write("System Health Check Results:")
        self.stdout.write("==========================")
        
        for component, result in results.items():
            if component == 'overall_healthy':
                continue
                
            status_icon = "✓" if result['healthy'] else "✗"
            self.stdout.write(f"{status_icon} {component.capitalize()}: {result['details']}")
            
            # Show additional details for failed components
            if not result['healthy']:
                for key, value in result.items():
                    if key not in ['healthy', 'details']:
                        self.stdout.write(f"  - {key}: {value}")
        
        self.stdout.write("==========================")
        overall_status = "✓ System is healthy" if results['overall_healthy'] else "✗ System has issues"
        self.stdout.write(overall_status)