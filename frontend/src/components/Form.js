import React, { useState, useEffect } from 'react';
import '../styles/Board.css'; // Asegúrate de que esta importación sea correcta

// Diccionario de tipos de proyectos, igual que en el backend
const PROJECT_TYPES = ["PROMINE", "PROMINE GRANDE", "ESPECIFICO-PEQUEÑO", "ESPECIFICO-GRANDE", "MISCELANEO", "MISCELANEO-GRANDE", "REQUERIMIENTO/GASTO"];
const Form = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    project_type: '', 
    start_date: ''
   });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        title: initialData.title,
        description: initialData.description,
        project_type: initialData.project_type,
        start_date: initialData.start_date
       });
    } else {
      setFormData({ title: '', description: '', project_type: '', start_date: '' });
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
    setFormData({ title: '', description: '', project_type: '', start_date: '' });
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
      
      <select 
        name="project_type" 
        value={formData.project_type} 
        onChange={handleChange} 
        required
      >
        <option value="" disabled>Selecciona tipo de proyecto</option>
        {PROJECT_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />

      <button type="submit">{initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'}</button>
    </form>
  );
};

export default Form;