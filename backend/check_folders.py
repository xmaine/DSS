from documents.models import Folder
from users.models import CustomUser

print("=== Folders ===")
for f in Folder.objects.all():
    print(f'{f.name} (ID: {f.id}) - Owner: {f.owner.username} (Dept: {f.owner.department})')

print("\n=== Users ===")
for u in CustomUser.objects.all():
    print(f'{u.username} ({u.role}) - Dept: {u.department}')

print("\n=== Employee Folder Access Check ===")
emp = CustomUser.objects.get(username="emponly")
print(f'Employee {emp.username} is in department: {emp.department}')
accessible_folders = Folder.objects.filter(owner__department=emp.department)
print(f'Folders accessible to {emp.username}:')
for f in accessible_folders:
    print(f'  - {f.name}')