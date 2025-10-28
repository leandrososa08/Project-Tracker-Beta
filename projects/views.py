from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Project
from .serializers import ProjectSerializer

class ProjectPermission(permissions.BasePermission):
    """
    Control de permisos por rol:
      - ADMIN: acceso total.
      - SUPERVISOR: CRUD solo en sus proyectos, lectura de los demás.
      - USUARIO: solo lectura en sus proyectos.
    """
    def has_permission(self, request, view):
        # Permitir acceso si es autenticado
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == 'ADMIN':
            return True  # acceso total
        elif user.role == 'SUPERVISOR':
            if view.action in ['retrieve', 'list', 'others']:
                return True
            return obj.responsible == user  # puede modificar solo los suyos
        elif user.role == 'USUARIO':
            if view.action in ['retrieve', 'list']:
                return obj.responsible == user
            return False
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [ProjectPermission]

    def perform_create(self, serializer):
        """Asigna automáticamente el responsable al usuario autenticado."""
        serializer.save(responsible=self.request.user)

    def get_queryset(self):
        """Filtra según rol y agrega endpoint de solo lectura."""
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.none()

        if user.role == 'ADMIN':
            return Project.objects.all()
        elif user.role == 'SUPERVISOR':
            return Project.objects.filter(responsible=user)
        elif user.role == 'USUARIO':
            return Project.objects.filter(responsible=user)
        return Project.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def others(self, request):
        """Lista los proyectos de otros usuarios (solo lectura)."""
        user = request.user
        if user.role in ['ADMIN', 'SUPERVISOR']:
            others = Project.objects.exclude(responsible=user)
            serializer = self.get_serializer(others, many=True)
            return Response(serializer.data)
        return Response([])
