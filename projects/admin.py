from django.contrib import admin
from .models import Project, UserActivity

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'project_type', 'status', 'responsible', 'start_date', 'end_date')
    list_filter = ('project_type', 'status', 'responsible')
    search_fields = ('title', 'description')

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'project', 'created_at')
    list_filter = ('user',)
