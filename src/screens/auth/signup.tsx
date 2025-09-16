import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { register } from '@/api/auth';
import { ROUTES } from '@/utils/constants';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await register(
        formData.email,
        formData.password,
        formData.username,
        formData.firstName
      );
      
      // Registration successful - for now, just redirect without auto-login
      if (response.data.userId) {
        // Show success message or redirect to login
        navigate(ROUTES.LOGIN, { 
          state: { message: 'Account created successfully! Please sign in.' }
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-home-background font-helvetica">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-home-background">
        <div className="flex items-center justify-between h-20 max-w-9xl mx-auto px-6 lg:px-8">
          <h1 
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
            onClick={handleBackToHome}
          >
            Noted
          </h1>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <nav className="flex items-center gap-8">
              <a href="/#features" className="text-foreground-secondary hover:text-foreground transition-colors">Features</a>
              <a href="/#how-it-works" className="text-foreground-secondary hover:text-foreground transition-colors">How it works</a>
            </nav>
          </div>
          
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12 pt-32">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-foreground mb-2">Join Noted</h1>
            <p className="text-foreground-secondary">Start your learning journey today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.firstName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-border focus:ring-primary-blue focus:border-primary-blue'
                }`}
                placeholder="Enter your first name"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.username 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-border focus:ring-primary-blue focus:border-primary-blue'
                }`}
                placeholder="Choose a username"
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-border focus:ring-primary-blue focus:border-primary-blue'
                }`}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-border focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              {!fieldErrors.password && (
                <p className="text-xs text-foreground-tertiary mt-1">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-orange text-white hover:bg-hover-orange rounded-lg py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Get started'}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-foreground-tertiary leading-relaxed">
              By signing up, you agree to our{' '}
              <button className="text-primary-blue hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-primary-blue hover:underline">
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-primary-blue hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
