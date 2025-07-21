import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, BookOpen, Brain, Zap, Users, CheckCircle, ArrowRight, Star, Play } from "lucide-react";
import { ROUTES } from '@/utils/constants';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-6 lg:px-12 py-5">
          <div className="text-3xl font-bold text-foreground tracking-tight">Noted</div>
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#features" className="text-gray-600 hover:text-foreground transition-all duration-300 font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-foreground transition-all duration-300 font-medium">How it works</a>
            <a href="#pricing" className="text-gray-600 hover:text-foreground transition-all duration-300 font-medium">Pricing</a>
          </nav>
          <Button 
            variant="primary"
            className="rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-24 lg:py-40">
        <div className="max-w-8xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h1 className="text-6xl lg:text-8xl font-bold text-foreground leading-tight mb-10 tracking-tight">
              Learning would be easier if you had a{' '}
              <span className="bg-gradient-to-r from-primary-blue via-primary-orange to-primary-yellow bg-clip-text text-transparent">
                tutor at all times
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              Transform your study experience with AI-powered note-taking and personalized tutoring. 
              Get instant answers, organize your thoughts, and accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="secondary"
                className="rounded-full px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                onClick={handleGetStarted}
              >
                Start learning now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <button className="flex items-center gap-3 text-primary-blue hover:text-primary-orange transition-all duration-300 font-semibold text-lg group">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
                Watch demo video
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-7xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/30 to-primary-orange/30 rounded-[2rem] blur-[4rem] scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-yellow/20 to-primary-blue/20 rounded-[2rem] blur-[6rem] scale-110"></div>
            <img 
              src="/screenshot.png" 
              alt="Noted App Screenshot" 
              className="relative rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-200/50 w-full backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-12 py-32 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Everything you need to excel
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Powerful tools designed to enhance your learning experience and help you achieve your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <img src="/dart.svg" alt="AI Tutoring" className="w-10 h-10 filter brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">AI-Powered Tutoring</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Get instant answers to your questions with our intelligent AI tutor that understands your learning style and provides personalized explanations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">Smart Note Organization</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Organize your notes automatically with intelligent categorization, tagging, and search capabilities that make finding information effortless.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-yellow to-primary-yellow/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">Instant Insights</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Get real-time insights and summaries from your notes, helping you identify key concepts and connections you might have missed.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-green to-primary-green/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">Collaborative Learning</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Share notes and insights with classmates, create study groups, and learn together in a collaborative environment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <img src="/checkpoint.svg" alt="Progress Tracking" className="w-10 h-10 filter brightness-0 invert" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Monitor your learning progress with detailed analytics and insights that help you stay on track and identify areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-5">Premium Content</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Access curated study materials, practice problems, and expert-created content tailored to your curriculum and learning objectives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-32">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Get started in minutes and transform your learning experience with our intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Create Your Account</h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
                Sign up in seconds and set up your personalized learning profile with your subjects and goals.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Start Taking Notes</h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
                Begin capturing your thoughts and ideas with our intelligent note-taking system that learns from your style.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-yellow to-primary-yellow/80 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Learn Faster</h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
                Get instant help from your AI tutor, organize your knowledge, and accelerate your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 lg:px-12 py-32 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-8 tracking-tight">Why students love Noted</h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of students who have transformed their learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <img src="/check.svg" alt="Check" className="w-8 h-8 filter brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Improved Academic Performance</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Students see an average 25% improvement in test scores and assignment grades after using Noted for just one semester.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <img src="/check.svg" alt="Check" className="w-8 h-8 filter brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Time-Saving Study Sessions</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Cut your study time in half with AI-powered insights and smart organization that highlights what matters most.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-yellow to-primary-yellow/80 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <img src="/check.svg" alt="Check" className="w-8 h-8 filter brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Better Understanding</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Gain deeper insights into complex topics with personalized explanations tailored to your learning style.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-primary-green/80 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <img src="/check.svg" alt="Check" className="w-8 h-8 filter brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Increased Confidence</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Feel more prepared and confident in class discussions and exams with comprehensive study materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="px-6 lg:px-12 py-32">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-8 tracking-tight">Your classes, organized</h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Keep all your subjects organized in one place with beautiful, intuitive project cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <Card className="bg-gradient-to-br from-primary-blue to-primary-blue/90 border-0 rounded-[2rem] min-h-[280px] shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group">
              <CardContent className="p-12 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-4 h-4 bg-white/40 rounded-full group-hover:bg-white/60 transition-all duration-300"></div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider">Physics</div>
                </div>
                <div>
                  <h3 className="text-white text-4xl font-bold mb-3">AP Physics</h3>
                  <p className="text-white/80 text-base font-medium">15 notes • 8 assignments</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary-orange to-primary-orange/90 border-0 rounded-[2rem] min-h-[280px] shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group">
              <CardContent className="p-12 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-4 h-4 bg-white/40 rounded-full group-hover:bg-white/60 transition-all duration-300"></div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider">Computer Science</div>
                </div>
                <div>
                  <h3 className="text-white text-4xl font-bold mb-1 leading-tight">RAG Note</h3>
                  <h4 className="text-white text-4xl font-bold mb-3 leading-tight">Application</h4>
                  <p className="text-white/80 text-base font-medium">23 notes • 12 assignments</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary-yellow to-primary-yellow/90 border-0 rounded-[2rem] min-h-[280px] shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group">
              <CardContent className="p-12 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-4 h-4 bg-white/40 rounded-full group-hover:bg-white/60 transition-all duration-300"></div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider">Biology</div>
                </div>
                <div>
                  <h3 className="text-white text-4xl font-bold mb-3">AP Biology</h3>
                  <p className="text-white/80 text-base font-medium">31 notes • 6 assignments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-32 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-8xl mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl lg:text-7xl font-bold text-foreground mb-10 tracking-tight">
              Ready to transform your learning?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto font-light">
              Join thousands of students who are already learning smarter, not harder, with Noted.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="secondary"
                className="rounded-full px-16 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                onClick={handleGetStarted}
              >
                Get started for free
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <p className="text-gray-500 text-base font-medium">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div>
              <div className="text-3xl font-bold mb-6">Noted</div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Empowering students to learn smarter with AI-powered note-taking and tutoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 text-lg">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-16 pt-10 text-center text-gray-400">
            <p className="text-lg">&copy; 2024 Noted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
