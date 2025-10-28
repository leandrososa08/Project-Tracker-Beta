from django.urls import path
from .views import LoginView, LogoutView, ProfileView, UsersListView
from .csrf import csrf_token   # ✅ Importa la nueva vista CSRF

urlpatterns = [
    path('login/', LoginView.as_view(), name='api-login'),
    path('logout/', LogoutView.as_view(), name='api-logout'),
    path('profile/', ProfileView.as_view(), name='api-profile'),
    path('users/', UsersListView.as_view(), name='api-users'),

    # ✅ Nuevo endpoint para obtener token CSRF
    path('csrf/', csrf_token, name='api-csrf'),
]
