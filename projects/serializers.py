from rest_framework import serializers  
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    # 👤 Campo para mostrar el nombre del responsable (solo lectura)
    responsible = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'project_type', 'start_date', 'end_date', 'status', 'created_at', 'completed', 'responsible']

    def create(self, validated_data):
        # Permite crear el proyecto sin la fecha de finalización
        project = Project.objects.create(**validated_data)
        return project

    def update(self, instance, validated_data):
        # Actualiza los campos y recalcula la fecha de finalización si es necesario 
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.project_type = validated_data.get('project_type', instance.project_type)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.status = validated_data.get('status', instance.status)
        instance.completed = validated_data.get('completed', instance.completed)
        
        # Si se actualiza el tipo o la fecha de inicio, recalcula la fecha de fin
        if 'project_type' in validated_data or 'start_date' in validated_data:
            instance.end_date = None # Fuerza el recálculo
            instance.calculate_end_date()
            
        instance.save()
        return instance