from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, metrics

# 🔹 Router automático para el ViewSet
router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),                 # ✅ /api/projects/ y /api/projects/<id>/
    path('metrics/', metrics.get_metrics, name='metrics'),  # ✅ /api/metrics/
]
