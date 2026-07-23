import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, User, Mail } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border-color bg-bg-primary/80 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-3xl font-medium tracking-tight hover:text-accent transition-colors">
            Portfolio
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-text-muted">
            <a href="/#about" className="hover:text-text-primary transition-colors">About</a>
            <a href="/#projects" className="hover:text-text-primary transition-colors">Projects</a>
            <a href="/#contact" className="hover:text-text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="max-w-[1200px] mx-auto px-6 py-12 md:py-24"
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="border-t border-border-color py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <a href="#" className="hover:text-accent transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent transition-colors"><User className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Mail className="w-5 h-5" /></a>
            <Link to="/admin" className="hover:text-accent transition-colors ml-4 text-xs uppercase tracking-wider font-bold">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
