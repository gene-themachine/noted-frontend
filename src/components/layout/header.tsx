import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-20 px-6 lg:px-8 bg-home-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full max-w-9xl mx-auto">
        <h1 
          className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
          onClick={() => navigate('/dashboard')}
        >
          Noted
        </h1>
        
        <nav className="flex items-center gap-6">
          <button 
            className="group relative w-12 h-12 bg-gradient-to-br from-home-avatar to-foreground-tertiary hover:from-foreground-tertiary hover:to-foreground-secondary rounded-full shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
            aria-label="User profile"
          >
            <User className="w-6 h-6 text-foreground-inverse group-hover:text-surface transition-colors duration-300" />
            <div className="absolute inset-0 rounded-full bg-surface/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
