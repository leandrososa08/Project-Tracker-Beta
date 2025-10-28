import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <button onClick={() => onEdit(project)}>Editar</button>
      <button onClick={() => onDelete(project.id)}>Eliminar</button>
    </div>
  );
};

export default ProjectCard;