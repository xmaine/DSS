import requests
import json

# Test the admin dashboard endpoint
try:
    response = requests.get('http://127.0.0.1:8000/api/admin/dashboard/')
    print("Dashboard endpoint status:", response.status_code)
    if response.status_code == 200:
        print("Dashboard data:", json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)
except Exception as e:
    print("Exception:", str(e))

# Test the documents endpoint
try:
    response = requests.get('http://127.0.0.1:8000/api/documents/')
    print("\nDocuments endpoint status:", response.status_code)
    if response.status_code == 200:
        print("Documents data:", json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)
except Exception as e:
    print("Exception:", str(e))