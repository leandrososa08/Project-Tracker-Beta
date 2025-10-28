from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project

# Duraciones promedio por tipo y estado (en días)
PROJECT_TYPE_DURATIONS = {
    'PROMINE': {'DISEÑO': 4, 'CONSTRUCCION': 5, 'CREACION DE FACILIDADES': 2},
    'PROMINE GRANDE': {'DISEÑO': 10, 'CONSTRUCCION': 21, 'CREACION DE FACILIDADES': 4},
    'ESPECIFICO-PEQUEÑO': {'DISEÑO': 12, 'CONSTRUCCION': 27, 'CREACION DE FACILIDADES': 6},
    'ESPECIFICO-GRANDE': {'DISEÑO': 15, 'CONSTRUCCION': 37, 'CREACION DE FACILIDADES': 8},
    'MISCELANEO': {'DISEÑO': 4, 'CONSTRUCCION': 6, 'CREACION DE FACILIDADES': 2},
    'MISCELANEO-GRANDE': {'DISEÑO': 6, 'CONSTRUCCION': 19, 'CREACION DE FACILIDADES': 3},
    'REQUERIMIENTO/GASTO': {'DISEÑO': 4, 'CONSTRUCCION': 8, 'CREACION DE FACILIDADES': 2},
}

# Porcentaje base de avance por estado
STATUS_PROGRESS = {
    'DISEÑO': 25,
    'CONSTRUCCION': 50,
    'CREACION DE FACILIDADES': 75,
    'FINALIZADO': 100,
}

@api_view(['GET'])
def get_metrics(request):
    projects = Project.objects.all()
    today = date.today()

    total_projects = projects.count()

    # Inicializar contadores por estado
    tasks_by_state = {
        'DISEÑO': 0,
        'CONSTRUCCION': 0,
        'CREACION DE FACILIDADES': 0,
        'FINALIZADO': 0,
        'PAUSADO/DETENIDO': 0,
    }

    progress_by_project = []
    overdue_projects = []

    for p in projects:
        # Normalizar estado
        current_status = p.status.upper()

        if current_status in ['ACTIVO', 'DISEÑO']:
            status_key = 'DISEÑO'
        elif current_status in ['CONSTRUCCION', 'CONSTRUCCIÓN']:
            status_key = 'CONSTRUCCION'
        elif current_status in ['CREACION', 'CREACIÓN DE FACILIDADES']:
            status_key = 'CREACION DE FACILIDADES'
        elif current_status in ['FINALIZADO', 'COMPLETADO']:
            status_key = 'FINALIZADO'
        else:
            status_key = 'PAUSADO/DETENIDO'

        tasks_by_state[status_key] = tasks_by_state.get(status_key, 0) + 1

        # Calcular progreso base por estado
        progress = STATUS_PROGRESS.get(status_key, 0)
        alert_message = None

        # Duración esperada según tipo y estado
        type_durations = PROJECT_TYPE_DURATIONS.get(p.project_type, {})
        expected_days = type_durations.get(status_key)

        # Calcular tiempo real
        if p.start_date and expected_days:
            days_elapsed = (today - p.start_date).days

            # Progreso dinámico: mezcla entre avance por estado y tiempo transcurrido
            if days_elapsed > 0 and expected_days > 0:
                time_progress = min((days_elapsed / expected_days) * 100, 100)
                progress = (progress + time_progress) / 2

            # Si ya pasó del tiempo estimado y no está finalizado → alerta
            if days_elapsed > expected_days and status_key != 'FINALIZADO':
                alert_message = "¡Proyecto pasado de fecha!"
                overdue_projects.append(p.title)

        # ✅ Aquí agregamos el responsable
        progress_by_project.append({
            'title': p.title,
            'type': p.project_type,
            'status': status_key,
            'responsible': str(p.responsible) if p.responsible else "Sin asignar",
            'progress': round(progress, 2),
            'alert': alert_message,
        })

    return Response({
        'total_projects': total_projects,
        'tasks_by_state': tasks_by_state,
        'progress_by_project': progress_by_project,
        'overdue_projects': overdue_projects,
    })