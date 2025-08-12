import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Zap, Users, CheckCircle, ArrowRight, Star } from "lucide-react";
import { ROUTES } from '@/utils/constants';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen bg-white font-helvetica">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border-light">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-8 py-5">
          <div className="text-2xl font-bold text-foreground">Noted</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground-secondary hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground-secondary hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="text-foreground-secondary hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <Button 
            className="bg-primary-blue text-white hover:bg-hover-blue rounded-lg px-6 py-2"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
              Learning would be easier if you had a{' '}
              <span className="text-primary-blue">tutor at all times</span>
            </h1>
            <p className="text-lg text-foreground-secondary mb-8 leading-relaxed">
              Transform your study experience with AI-powered note-taking and personalized tutoring. 
              Get instant answers, organize your thoughts, and accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-primary-orange text-white hover:bg-hover-orange rounded-lg px-8 py-3 text-base flex items-center gap-2"
                onClick={handleGetStarted}
              >
                Start learning now
                <ArrowRight className="w-4 h-4" />
              </Button>
              <button className="text-primary-blue hover:text-hover-blue transition-colors text-base">
                Watch demo video
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="max-w-5xl mx-auto">
            <img 
              src="/screenshot.png" 
              alt="Noted App Screenshot" 
              className="rounded-2xl shadow-xl border border-border-light w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-8 py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to excel
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Powerful tools designed to enhance your learning experience and help you achieve your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Tutoring</h3>
              <p className="text-foreground-secondary">
                Get instant answers to your questions with our intelligent AI tutor that understands your learning style and provides personalized explanations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Note Organization</h3>
              <p className="text-foreground-secondary">
                Organize your notes automatically with intelligent categorization, tagging, and search capabilities that make finding information effortless.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Insights</h3>
              <p className="text-foreground-secondary">
                Get real-time insights and summaries from your notes, helping you identify key concepts and connections you might have missed.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Collaborative Learning</h3>
              <p className="text-foreground-secondary">
                Share notes and insights with classmates, create study groups, and learn together in a collaborative environment.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-foreground-secondary">
                Monitor your learning progress with detailed analytics and insights that help you stay on track and identify areas for improvement.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-light">
              <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Content</h3>
              <p className="text-foreground-secondary">
                Access curated study materials, practice problems, and expert-created content tailored to your curriculum and learning objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Get started in minutes and transform your learning experience with our intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Create Your Account</h3>
              <p className="text-foreground-secondary">
                Sign up in seconds and set up your personalized learning profile with your subjects and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Start Taking Notes</h3>
              <p className="text-foreground-secondary">
                Begin capturing your thoughts and ideas with our intelligent note-taking system that learns from your style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Learn Faster</h3>
              <p className="text-foreground-secondary">
                Get instant help from your AI tutor, organize your knowledge, and accelerate your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 lg:px-8 py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why students love Noted</h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Join thousands of students who have transformed their learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Improved Academic Performance</h3>
                <p className="text-foreground-secondary">
                  Students see an average 25% improvement in test scores and assignment grades after using Noted for just one semester.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Time-Saving Study Sessions</h3>
                <p className="text-foreground-secondary">
                  Cut your study time in half with AI-powered insights and smart organization that highlights what matters most.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-yellow rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Better Understanding</h3>
                <p className="text-foreground-secondary">
                  Gain deeper insights into complex topics with personalized explanations tailored to your learning style.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Increased Confidence</h3>
                <p className="text-foreground-secondary">
                  Feel more prepared and confident in class discussions and exams with comprehensive study materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Your classes, organized</h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Keep all your subjects organized in one place with beautiful, intuitive project cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-primary-blue rounded-2xl p-8 min-h-[200px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Physics</div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-1">AP Physics</h3>
                <p className="text-white/80 text-sm">15 notes • 8 assignments</p>
              </div>
            </div>

            <div className="bg-primary-orange rounded-2xl p-8 min-h-[200px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Computer Science</div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-1">RAG Note Application</h3>
                <p className="text-white/80 text-sm">23 notes • 12 assignments</p>
              </div>
            </div>

            <div className="bg-primary-yellow rounded-2xl p-8 min-h-[200px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Biology</div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-1">AP Biology</h3>
                <p className="text-white/80 text-sm">31 notes • 6 assignments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-20 bg-background-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to transform your learning?
          </h2>
          <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning smarter, not harder, with Noted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-primary-orange text-white hover:bg-hover-orange rounded-lg px-8 py-3 text-base flex items-center gap-2"
              onClick={handleGetStarted}
            >
              Get started for free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-foreground-tertiary text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 bg-foreground text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Noted</div>
              <p className="text-gray-400">
                Empowering students to learn smarter with AI-powered note-taking and tutoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Noted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}