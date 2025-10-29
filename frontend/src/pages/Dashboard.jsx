import React, { useEffect, useState } from 'react';
import API from '../api';
import TasksByStateChart from '../components/TasksByStateChart';
import ProjectsStatusPie from '../components/ProjectsStatusPie';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    API.get('metrics/')
      .then(res => setMetrics(res.data))
      .catch(err => console.error('Error loading metrics:', err));
  }, []);

  if (!metrics) return <div>Cargando métricas...</div>;

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#2ecc71'; // verde
    if (progress >= 50) return '#f1c40f'; // amarillo
    return '#e74c3c'; // rojo
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>📊 Dashboard de Proyectos</h2>

      <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
        <div><strong>Total de proyectos:</strong> {metrics.total_projects}</div>
      </div>

      {/* === GRAFICOS === */}
      <div style={{ display: 'flex', gap: 40, marginBottom: 40 }}>
        <div style={{ width: 400 }}>
          <h4>Tareas por estado</h4>
          <TasksByStateChart data={metrics.tasks_by_state} />
        </div>
        <div style={{ width: 300 }}>
          <h4>Avance por proyecto</h4>
          <ProjectsStatusPie data={metrics.progress_by_project} />
        </div>
      </div>

      {/* === LISTA DE PROYECTOS === */}
      <div>
        <h3 style={{ marginBottom: 30 }}>📁 Detalle de proyectos</h3>
        {metrics.progress_by_project.map((p, index) => (
          <div
            key={index}
            style={{
              background: '#fafafa',
              border: `2px solid ${getProgressColor(p.progress)}`,
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {p.title}
              {p.alert && <span style={{ color: '#e74c3c' }}>⚠️</span>}
            </h4>
            <p style={{ margin: '4px 0 4px 0', fontSize: 20 }}>
              <strong>Responsable:</strong> {p.responsible || 'Sin asignar'}
            </p>
            <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>
              <strong>Tipo:</strong> {p.type} &nbsp;|&nbsp;
              <strong>Estado:</strong> {p.status}
            </p>
            <div style={{ height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${p.progress}%`,
                  height: '100%',
                  background: getProgressColor(p.progress),
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
            {p.alert && (
              <p style={{ color: '#e74c3c', marginTop: 4, fontWeight: 'bold', fontSize: 13 }}>
                {p.alert}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}