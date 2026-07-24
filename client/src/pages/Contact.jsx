import React from 'react';
import { Mail, Globe, User } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-serif mb-6">Contact</h1>
      
      <div className="flex flex-col gap-6">
        <a htef="tel:0889639520">
          <Phone className="w-6 h-6" /> 0889639520
        </a>
        <a href="mailto:hello@example.com" className="flex items-center gap-4 text-xl hover:text-accent transition-colors">
          <Mail className="w-6 h-6" /> bestktz12@gmail.com
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-accent transition-colors">
          <Globe className="w-6 h-6" /> github.com/BaDB2o1YGod
        </a>
      </div>
    </div>
  );
}
