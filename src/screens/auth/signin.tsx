import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { login } from '@/api/auth';
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
      await login(formData.email, formData.password);
      navigate(ROUTES.HOME);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-home-background font-helvetica overflow-hidden">
      {/* Animated background shapes - matching landing page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header - matching landing page */}
      <header className="fixed top-0 left-0 right-0 z-30 h-20 px-6 lg:px-8 bg-home-background/90 backdrop-blur-md border-b border-border-light/50">
        <div className="flex items-center justify-between h-full w-full">
          <h1
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
            onClick={handleBackToHome}
          >
            Noted
          </h1>

          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <nav className="flex items-center gap-8">
              <a href="/#features" className="text-foreground-secondary hover:text-foreground transition-all duration-200 hover:translate-y-[-2px]">Features</a>
            </nav>
          </div>

          <Button
            className="bg-foreground text-white hover:bg-foreground/90 rounded-lg px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Sign up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-6 lg:px-8 py-12 pt-24 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          {/* Welcome Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-blue/10 to-primary-green/10 border border-primary-blue/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-blue" />
              <span className="text-primary-blue font-semibold text-sm">WELCOME BACK</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">Sign in to Noted</h1>
            <p className="text-lg text-foreground-secondary">Continue your learning journey</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-gradient-to-r from-primary-green/10 to-primary-green/5 border-l-4 border-primary-green p-4 rounded-r-2xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                <p className="text-primary-green text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Sign In Form Card - elevated with shadow like landing page demo */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/20 to-primary-green/20 rounded-3xl blur-2xl transform scale-105 opacity-50"></div>

            {/* Form Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                      fieldErrors.email
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-border-light focus:ring-primary-blue focus:border-primary-blue hover:border-border'
                    }`}
                    placeholder="Enter your email"
                  />
                  {fieldErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
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
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl bg-white text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                        fieldErrors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-border-light focus:ring-primary-blue focus:border-primary-blue hover:border-border'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground-secondary transition-all duration-200 hover:scale-110"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-blue text-white hover:bg-hover-blue rounded-xl py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                {/* Forgot Password */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-foreground-tertiary hover:text-foreground-secondary text-sm transition-colors hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-foreground-secondary">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className="text-primary-blue hover:text-hover-blue font-semibold transition-colors hover:underline"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
