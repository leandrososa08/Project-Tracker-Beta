// src/components/BoardHeader.js
import React from 'react';

const BoardHeader = () => {
    return (
      <div className="board-header">
        <div className="column-cell header-cell">Título</div>
        <div className="column-cell header-cell">Descripción</div>
        <div className="column-cell header-cell">Tipo</div>
        <div className="column-cell header-cell">Fecha de inicio</div>
        <div className="column-cell header-cell">Fecha de fin</div>
        <div className="column-cell header-cell">Estado</div>
        <div className="column-cell header-cell">Acciones</div>
    </div>
  );
};

export default BoardHeader;