import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { login } from '@/api/auth';
import { setBearerToken } from '@/utils/localStorage';
import { ROUTES } from '@/utils/constants';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);

  // Check for success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent the message from persisting
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
      const response = await login(formData.email, formData.password);
      
      if (response.data.token) {
        setBearerToken(response.data.token);
        navigate(ROUTES.HOME);
      }
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422 && Array.isArray(data)) {
        // Validation errors - display field-specific errors
        const errors: {[key: string]: string} = {};
        data.forEach((error: any) => {
          if (error.field && error.message) {
            errors[error.field] = error.message;
          }
        });
        setFieldErrors(errors);
      } else if (status === 401) {
        // Invalid credentials
        setError(data?.message || 'Invalid email or password.');
      } else if (status >= 500) {
        // Server error
        setError('Server error. Please try again later.');
      } else {
        // General error
        setError(data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-white font-helvetica">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>
          <div className="text-xl font-bold text-foreground">Noted</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-foreground-secondary">Sign in to continue your learning journey</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-blue text-white hover:bg-hover-blue rounded-lg py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className="text-primary-blue hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <button className="text-foreground-tertiary hover:text-foreground-secondary text-sm transition-colors">
              Forgot your password?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}