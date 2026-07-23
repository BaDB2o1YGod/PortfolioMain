import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { API_URL } from '../lib/utils';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-text-primary mb-4">{error || 'Project not found'}</h2>
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col gap-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">{project.title}</h1>
        <p className="text-xl text-text-muted">{project.summary}</p>
        
        <div className="flex gap-4 mt-6 text-sm text-text-muted border-b border-border-color pb-6">
          <span>{project.category}</span>
          <span>•</span>
          <span>{new Date(project.startedAt).getFullYear()}</span>
          {project.liveUrl && (
            <>
              <span>•</span>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                View Live Site
              </a>
            </>
          )}
        </div>
      </div>

      <div className="w-full bg-bg-secondary rounded-xl overflow-hidden relative flex items-center justify-center min-h-[200px]">
        {project.coverImage ? (
          <img 
            src={project.coverImage} 
            alt={project.title} 
            className="w-full h-auto block max-h-[700px] object-contain bg-bg-primary/5"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x400/1a1a1a/888888?text=Image+Not+Found';
            }}
          />
        ) : (
          <span className="text-text-muted text-sm">No Image</span>
        )}
      </div>

      <div className="max-w-3xl">
        <h2 className="text-2xl font-serif mb-4 text-text-primary">About the project</h2>
        <div className="text-text-muted whitespace-pre-wrap leading-relaxed">
          {project.description}
        </div>
      </div>

      {project.images && project.images.length > 0 && (
        <div className="flex flex-col gap-8 pt-8 border-t border-border-color">
          <h2 className="text-2xl font-serif text-text-primary">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((imgUrl, idx) => (
              <div key={idx} className="w-full bg-bg-secondary rounded-lg overflow-hidden flex items-center justify-center min-h-[150px]">
                <img 
                  src={imgUrl} 
                  alt={`${project.title} gallery ${idx + 1}`} 
                  className="w-full h-auto block"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x400/1a1a1a/888888?text=Image+Not+Found';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
