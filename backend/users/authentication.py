from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Session authentication class that exempts CSRF validation
    """
    def enforce_csrf(self, request):
        """
        Override the enforce_csrf method to do nothing
        """
        return  # To not perform the csrf check previously happening