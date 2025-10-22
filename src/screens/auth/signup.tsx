import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-home-background font-helvetica overflow-hidden">
      {/* Animated background shapes - matching landing page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-orange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-primary-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign in
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-6 lg:px-8 py-4 pt-24 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-lg mx-auto">
          {/* Welcome Badge */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-orange/10 to-primary-blue/10 border border-primary-orange/20 px-3 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary-orange" />
              <span className="text-primary-orange font-semibold text-xs">START LEARNING ACTIVELY</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Join Noted</h1>
            <p className="text-base text-foreground-secondary">Create your account in seconds</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-2xl">
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Sign Up Form Card - elevated with shadow like landing page demo */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 to-primary-blue/20 rounded-3xl blur-2xl transform scale-105 opacity-50"></div>

            {/* Form Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 lg:p-7 space-y-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-semibold text-foreground mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2.5 border-2 rounded-xl bg-white text-sm text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      fieldErrors.firstName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-border-light focus:ring-primary-orange focus:border-primary-orange hover:border-border'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className="block text-xs font-semibold text-foreground mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2.5 border-2 rounded-xl bg-white text-sm text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      fieldErrors.username
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-border-light focus:ring-primary-orange focus:border-primary-orange hover:border-border'
                    }`}
                    placeholder="Choose a username"
                  />
                  {fieldErrors.username && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2.5 border-2 rounded-xl bg-white text-sm text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      fieldErrors.email
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-border-light focus:ring-primary-orange focus:border-primary-orange hover:border-border'
                    }`}
                    placeholder="Enter your email"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-foreground mb-1.5">
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
                      className={`w-full px-3 py-2.5 pr-10 border-2 rounded-xl bg-white text-sm text-foreground placeholder-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                        fieldErrors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-border-light focus:ring-primary-orange focus:border-primary-orange hover:border-border'
                      }`}
                      placeholder="Create a password (8+ characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground-secondary transition-all duration-200 hover:scale-110"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-orange text-white hover:bg-hover-orange rounded-xl py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Terms and Privacy */}
                <div className="text-center pt-1">
                  <p className="text-[10px] text-foreground-tertiary leading-relaxed">
                    By signing up, you agree to our{' '}
                    <button type="button" className="text-primary-orange hover:underline font-medium">
                      Terms
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-primary-orange hover:underline font-medium">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-foreground-secondary">
              Already have an account?{' '}
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-primary-orange hover:text-hover-orange font-semibold transition-colors hover:underline"
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
