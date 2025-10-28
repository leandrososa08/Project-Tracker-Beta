from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Rol', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff')
