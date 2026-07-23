import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    coverImage: '',
    liveUrl: '',
    category: 'Web',
    images: '',
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        images: formData.images ? formData.images.split(',').map(url => url.trim()) : [],
      };

      if (!editingId) {
        projectData.startedAt = new Date().toISOString();
        projectData.techStack = [];
      }

      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData)
      });

      if (res.ok) {
        alert(editingId ? 'Project updated successfully!' : 'Project added successfully!');
        setFormData({ title: '', summary: '', description: '', coverImage: '', liveUrl: '', category: 'Web', images: '' });
        setEditingId(null);
        fetchProjects();
      } else {
        alert('Failed to save project');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      summary: project.summary,
      description: project.description,
      coverImage: project.coverImage,
      liveUrl: project.liveUrl || '',
      category: project.category || 'Web',
      images: project.images ? project.images.join(', ') : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif">Manage Projects</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{editingId ? 'Edit Project' : 'Add New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <label className="text-sm font-medium">Project Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="My Awesome Project"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Short Summary</label>
              <input 
                type="text" 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="A brief description of the project"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required
                rows={4}
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Detailed project description..."
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Cover Image URL (รูปปกผลงาน)</label>
              <input 
                type="url" 
                name="coverImage" 
                value={formData.coverImage} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Project Link (Live URL)</label>
              <input 
                type="url" 
                name="liveUrl" 
                value={formData.liveUrl} 
                onChange={handleChange} 
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://myproject.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full p-2 border border-border-color rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Web">Web</option>
                <option value="App">App</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Additional Images (Comma separated URLs)</label>
              <textarea 
                name="images" 
                value={formData.images} 
                onChange={handleChange} 
                rows={2}
                className="w-full p-2 border border-border-color rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://img1.com/a.jpg, https://img2.com/b.jpg"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                {editingId ? 'Update Project' : 'Add Project'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" size="lg" onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', summary: '', description: '', coverImage: '', liveUrl: '', category: 'Web', images: '' });
                }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Existing Projects</h2>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-text-muted">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <Card key={project.id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="w-24 h-24 bg-bg-secondary rounded-md overflow-hidden shrink-0">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold font-serif text-lg">{project.title}</h3>
                      <p className="text-sm text-text-muted line-clamp-2">{project.summary}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
