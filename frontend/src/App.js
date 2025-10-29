import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getProjects, createProject, updateProject, deleteProject } from './api';
import Form from './components/Form';
import Board from './components/Board';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // 👈 nuevo dashboard
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await getProjects();
    // Ordenar proyectos (los atrasados primero)
    const sortedProjects = response.data.sort((a, b) => {
      const aIsOverdue = new Date(a.end_date) < new Date() && a.status !== 'pausado';
      const bIsOverdue = new Date(b.end_date) < new Date() && b.status !== 'pausado';

      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;

      return new Date(a.end_date) - new Date(b.end_date);
    });
    setProjects(sortedProjects);
  };

  const handleCreateProject = async (project) => {
    await createProject(project);
    fetchProjects();
  };

  const handleUpdateProject = async (id, project) => {
    await updateProject(id, project);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
  };

  const handleStatusChange = async (id, newStatus) => {
    const projectToUpdate = projects.find(p => p.id === id);
    if (projectToUpdate) {
      await updateProject(id, { ...projectToUpdate, status: newStatus });
      fetchProjects();
    }
  };

  return (
    <Router>
      <div className="App" style={{ padding: '20px' }}>
        {/* 🔹 Barra de navegación */}
        <nav style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <Link to="/">Proyectos</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
          <button
            onClick={async () => {
              try {
                await fetch('http://localhost:8000/api/auth/logout/', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'X-CSRFToken': document.cookie.split('csrftoken=')[1]?.split(';')[0] },
                });
                alert('Sesión cerrada.');
              } catch {
                alert('No se pudo cerrar sesión.');
              }
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#e74c3c',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </nav>

        {/* 🔹 Rutas principales */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Project Tracker</h1>
                <Form
                  onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                  initialData={editingProject}
                />
                <Board
                  projects={projects}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteProject}
                  onStatusChange={handleStatusChange}
                />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;