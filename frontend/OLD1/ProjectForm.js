import React, { useState, useEffect } from 'react';

const ProjectForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title, description: initialData.description });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      onSubmit(initialData.id, formData);
    } else {
      onSubmit(formData);
    }
    setFormData({ title: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Título del proyecto"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción del proyecto"
        required
      ></textarea>
      <button type="submit">{initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'}</button>
    </form>
  );
};

export default ProjectForm;