import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { logout } from '@/api/auth';
import { removeBearerToken } from '@/utils/localStorage';
import { ROUTES } from '@/utils/constants';

const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      removeBearerToken();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still clear the local token and redirect
      removeBearerToken();
      navigate(ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-20 px-6 lg:px-8 bg-home-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full w-full">
        <h1 
          className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
          onClick={() => navigate('/dashboard')}
        >
          Noted
        </h1>
        
        <nav className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="group relative w-10 h-10 bg-gradient-to-br from-home-avatar to-foreground-tertiary hover:from-foreground-tertiary hover:to-foreground-secondary rounded-full shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              aria-label="User profile"
            >
              <User className="w-6 h-6 text-foreground-inverse group-hover:text-surface transition-colors duration-300" />
              <div className="absolute inset-0 rounded-full bg-surface/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-light py-1 z-50">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background-secondary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
