// src/components/BoardRow.js
import React from 'react';

const BoardRow = ({ project, onEdit, onDelete, onStatusChange }) => {
    const isOverdue = new Date(project.end_date) < new Date();
    const isPaused = project.status === 'pausado';
  
    let overdueMessage = '';
    if (isOverdue && !isPaused) {
      overdueMessage = "¡Proyecto pasado de fecha!";
    }
  
    const rowClassName = `board-row ${isOverdue && !isPaused ? 'overdue' : ''} ${isPaused ? 'paused' : ''}`;
  
    return (
      <div className={rowClassName}>
        <div className="column-cell">{project.title}</div>
        <div className="column-cell">{project.description}</div>
        <div className="column-cell">{project.project_type}</div>
        <div className="column-cell">{project.start_date}</div>
        <div className="column-cell">{project.end_date}</div>
        <div className="column-cell">
          {overdueMessage && <span className="overdue-message">{overdueMessage}</span>}
          {isPaused && <span className="paused-message">Detenido/Pausado</span>}
        </div>
        <div className="column-cell actions">
          <button onClick={() => onEdit(project)}>Editar</button>
          <button onClick={() => onDelete(project.id)}>Eliminar</button>
          <button onClick={() => onStatusChange(project.id, isPaused ? 'activo' : 'pausado')}>
            {isPaused ? 'Reanudar' : 'Detener/Pausar'}
          </button>
      </div>
    </div>
  );
};

export default BoardRow;