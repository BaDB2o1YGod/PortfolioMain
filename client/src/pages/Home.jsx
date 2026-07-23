import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { API_URL } from '../lib/utils';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
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
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-32">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-6 max-w-3xl pt-12 md:pt-24">
        <motion.h1 
          className="text-5xl md:text-7xl font-serif text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Anupong Karam
        </motion.h1>
        <motion.p 
          className="text-xl text-text-muted max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Portfolio showcasing my work in Web development.
        </motion.p>
        <motion.div 
          className="flex gap-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button asChild size="lg">
            <a href="#projects">View Projects</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#contact">Get in Touch</a>
          </Button>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="flex flex-col gap-4">
        <h2 className="text-3xl font-serif text-text-primary border-b border-border-color pb-4">About Me</h2>
        <p className="text-lg text-text-muted max-w-2xl">
          Fourth-year Computer Science student at Buriram Rajabhat University with a foundation in
business process analysis and software development. Capable of gathering and analyzing
user requirements, designing systems, and developing web and application solutions aligned
with business objectives.Knowledgeable in database management, UI/UX prototyping with
Figma, and applying AI technologies to improve productivity. Seeking an opportunity as a
Business Analyst or Developer to further develop technical skills
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="flex flex-col gap-12">
        <div className="flex justify-between items-end border-b border-border-color pb-4">
          <h2 className="text-3xl font-serif text-text-primary">Selected Work</h2>
        </div>
        {loading ? (
          <p className="text-text-muted">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-text-muted">No projects found. Add some from the Admin Dashboard.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/project/${project.slug}`} className="block group">
                  <Card className="border-none shadow-none bg-transparent cursor-pointer rounded-none">
                    <CardContent className="p-0 flex flex-col gap-4">
                      <div className="w-full bg-bg-secondary rounded-lg overflow-hidden relative flex items-center justify-center min-h-[200px]">
                        {project.coverImage ? (
                          <img 
                            src={project.coverImage} 
                            alt={project.title} 
                            className="w-full max-h-[450px] object-contain block bg-bg-primary/5" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/800x400/1a1a1a/888888?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="aspect-[4/3] w-full bg-text-muted/10 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center text-sm text-text-muted">No Image</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-medium font-serif group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        {project.summary && (
                          <p className="text-base text-text-primary mt-1 line-clamp-2">{project.summary}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex flex-col gap-6 pt-12">
        <h2 className="text-3xl font-serif text-text-primary border-b border-border-color pb-4">Contact</h2>
        <div className="flex flex-col gap-6">
          <a href="mailto:bestktz12@gmail.com" className="flex items-center gap-4 text-xl hover:text-accent transition-colors">
            <Mail className="w-6 h-6" /> bestktz12@gmail.com
          </a>
          <a href="https://github.com/BaDB2o1YGod" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-accent transition-colors">
            <Globe className="w-6 h-6" /> github.com/BaDB2o1YGod
          </a>
        </div>
      </section>
    </div>
  );
}
