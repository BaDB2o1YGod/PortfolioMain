import React from 'react';
import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };  return (
    <div className="min-h-screen flex font-sans bg-bg-secondary/30">
      <aside className="w-64 border-r border-border-color bg-bg-primary flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border-color">
          <span className="font-serif text-lg font-semibold">Admin Panel</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4 text-sm font-medium">
          <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-bg-secondary text-text-primary transition-colors">Dashboard</Link>
          <Link to="/admin/projects" className="px-3 py-2 rounded-md hover:bg-bg-secondary text-text-primary transition-colors">Projects</Link>
          <Link to="/admin/settings" className="px-3 py-2 rounded-md hover:bg-bg-secondary text-text-primary transition-colors">Settings</Link>
        </nav>
        <div className="p-4 border-t border-border-color space-y-2">
          <button onClick={handleLogout} className="w-full block px-3 py-2 text-left text-sm text-red-500 hover:bg-bg-secondary rounded-md transition-colors">
            Logout
          </button>
          <Link to="/" className="w-full block px-3 py-2 text-left text-sm text-text-muted hover:bg-bg-secondary rounded-md transition-colors">
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
