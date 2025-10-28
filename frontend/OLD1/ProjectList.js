import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;