from django.db import models
from datetime import date, timedelta
from django.conf import settings    

class Project(models.Model):
    # Tipos de proyectos con su duración en días laborables
    PROJECT_TYPES = {
        "PROMINE": 11,
        "PROMINE GRANDE": 35,
        "ESPECIFICO-PEQUEÑO": 45,
        "ESPECIFICO-GRANDE": 60,
        "MISCELANEO": 12,
        "MISCELANEO-GRANDE": 28,
        "REQUERIMIENTO/GASTO": 14,
    }

    # Campo de opciones
    project_type = models.CharField(max_length=50, choices=[(key, key) for key in PROJECT_TYPES.keys()])
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, default='activo') # 'activo', 'pausado', 'detenido'
    
    # 👤 Nuevo campo responsable (relacionado con el modelo de usuario)
    responsible = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # usamos tu mismo enfoque
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projects'
    )

    def calculate_end_date(self):
        """Calcula la fecha de finalización basada en la fecha de inicio y el tipo de proyecto."""
        if self.start_date and self.project_type:
            duration = self.PROJECT_TYPES.get(self.project_type, 0)
            current_date = self.start_date
            days_added = 0
            while days_added < duration:
                current_date += timedelta(days=1)
                # Solo cuenta los días de la semana (lunes a viernes)
                if current_date.weekday() < 5:
                    days_added += 1
            self.end_date = current_date

    def save(self, *args, **kwargs):
        """Sobreescribe el método save para calcular la fecha de finalización antes de guardar."""
        if self.start_date and self.project_type and not self.end_date:
            self.calculate_end_date()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
# Create your models here.


from django.conf import settings

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    project = models.ForeignKey('Project', null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action}"
