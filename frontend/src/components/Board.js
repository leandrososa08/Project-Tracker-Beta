// src/components/Board.js
import React from 'react';
import BoardHeader from './BoardHeader';
import BoardRow from './BoardRow';
import '../styles/Board.css';

const Board = ({ projects, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="board-container">
      <div className="board-main">
        <BoardHeader />
        {projects.map((project) => (
          <BoardRow key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default Board;