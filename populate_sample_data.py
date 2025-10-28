# Script to populate sample data for Project Tracker.
# Usage: python manage.py shell < populate_sample_data.py

from django.contrib.auth import get_user_model
from projects.models import Project, Task, UserActivity
from django.utils import timezone
import random

User = get_user_model()

# Clear specific demo users if exist
for uname in ['admin','manager1','user1','user2']:
    try:
        u = User.objects.get(username=uname)
        u.delete()
    except User.DoesNotExist:
        pass

Project.objects.all().delete()
Task.objects.all().delete()
UserActivity.objects.all().delete()

# Create admin
admin = User.objects.create_superuser('admin', email='admin@example.com', password='admin123')
admin.role = 'admin'
admin.save()

# Create manager and users
manager = User.objects.create_user('manager1', email='manager@example.com', password='manager123')
manager.role = 'manager'
manager.save()

user1 = User.objects.create_user('user1', email='user1@example.com', password='user123')
user1.role = 'user'
user1.save()

user2 = User.objects.create_user('user2', email='user2@example.com', password='user123')
user2.role = 'user'
user2.save()

# Create projects
projects = []
for i in range(1,6):
    p = Project.objects.create(
        title=f"Project {i}",
        description=f"Sample project {i}",
        owner=random.choice([admin, manager, user1]),
        completed=(i%3==0)
    )
    projects.append(p)

# Create tasks
states = ['todo','in_progress','done']
for i in range(1,21):
    proj = random.choice(projects)
    assignee = random.choice([manager, user1, user2, None])
    state = random.choice(states)
    t = Task.objects.create(
        project=proj,
        title=f"Task {i} for {proj.title}",
        description="Auto-generated task",
        assigned_to=assignee,
        state=state,
    )
    UserActivity.objects.create(
        user=assignee if assignee else manager,
        action=f"created task {t.title}",
        project=proj,
        created_at=timezone.now()
    )

print("Sample data created: admin/admin123, manager/manager123, user1/user123, user2/user123")