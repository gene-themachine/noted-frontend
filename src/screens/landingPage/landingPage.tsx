import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Zap, MessageSquare, CheckCircle, ArrowRight, Star, FileText, Target, Lightbulb, Command } from "lucide-react";
import { ROUTES } from '@/utils/constants';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen bg-home-background font-helvetica">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-home-background">
        <div className="flex items-center justify-between h-20 max-w-9xl mx-auto px-6 lg:px-8">
          <h1 
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
            onClick={() => navigate(ROUTES.LANDING)}
          >
            Noted
          </h1>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <nav className="flex items-center gap-8">
              <a href="#features" className="text-foreground-secondary hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground-secondary hover:text-foreground transition-colors">How it works</a>
            </nav>
          </div>
          
          <Button 
            className="bg-primary-blue text-white hover:bg-hover-blue rounded-lg px-6 py-2"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-20 lg:py-32 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              The AI Study Companion That{' '}
              <span className="text-primary-blue">Lives Inside Your Notes</span>
            </h1>
            <p className="text-xl text-foreground-secondary mb-8 leading-relaxed max-w-3xl mx-auto">
              Stop re-reading endless summaries. Take notes, press <span className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">Cmd+Enter</span>, get instant AI answers. 
              Turn your content into flashcards and quizzes for active learning that actually sticks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-primary-orange text-white hover:bg-hover-orange rounded-lg px-8 py-3 text-lg flex items-center gap-2 shadow-lg"
                onClick={handleGetStarted}
              >
                Start Taking Smarter Notes
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="text-foreground-tertiary text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary-green" />
                Free to get started
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="max-w-5xl mx-auto">
            <img 
              src="/screenshot.png" 
              alt="Noted App - AI-powered note-taking with instant Q&A" 
              className="rounded-2xl shadow-2xl border border-border-light w-full"
            />
          </div>
        </div>
      </section>

      {/* CMD+Enter Feature Spotlight */}
      <section className="px-6 lg:px-8 py-20 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-blue/10 px-4 py-2 rounded-full mb-4">
              <Command className="w-4 h-4 text-primary-blue" />
              <span className="text-primary-blue font-medium text-sm">Signature Feature</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Stop Re-Reading, Start Asking
            </h2>
            <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
              Instead of scrolling through endless summaries, type any question in your notes and press <span className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">Cmd+Enter</span> 
              for instant AI-powered answers. Turn passive reading into active learning.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-border-light overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm text-foreground-secondary">Biology Notes - Chapter 3</span>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <div className="text-foreground-secondary text-sm">Your question:</div>
                <div className="bg-blue-50 border-l-4 border-primary-blue p-4 rounded-r-lg">
                  <p className="text-foreground font-medium">What is the difference between mitosis and meiosis?</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-primary-blue">
                    <span className="bg-gray-100 px-2 py-1 rounded font-mono">Cmd+Enter</span>
                    <span>pressed</span>
                  </div>
                </div>
                <div className="text-foreground-secondary text-sm">AI Answer:</div>
                <div className="bg-green-50 border-l-4 border-primary-green p-4 rounded-r-lg">
                  <p className="text-foreground">Based on your notes, mitosis produces two identical diploid cells for growth and repair, while meiosis creates four genetically diverse haploid gametes for reproduction. Key differences include chromosome number reduction and genetic recombination in meiosis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Study Tools Section */}
      <section id="features" className="px-6 lg:px-8 py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI Study Tools Generated From Your Notes
            </h2>
            <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
              Transform your notes into powerful study materials with one click. Our AI creates personalized flashcards, 
              quizzes, and practice questions tailored to your content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-border-light group hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Flashcards</h3>
              <p className="text-foreground-secondary mb-4">
                Automatically generate flashcards from your notes with spaced repetition. Star favorites and track your progress as you study.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-foreground">Front: "What causes photosynthesis?"</div>
                <div className="text-foreground-secondary mt-1">Back: "Light energy + CO₂ + H₂O → glucose + O₂"</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-border-light group hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Multiple Choice Quizzes</h3>
              <p className="text-foreground-secondary mb-4">
                Create challenging multiple choice questions with instant feedback. Perfect for exam preparation and knowledge testing.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-foreground mb-2">"Which organelle produces ATP?"</div>
                <div className="space-y-1 text-foreground-secondary">
                  <div>A) Nucleus</div>
                  <div className="text-primary-green">✓ B) Mitochondria</div>
                  <div>C) Ribosome</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-border-light group hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-green to-primary-green/80 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Free Response Practice</h3>
              <p className="text-foreground-secondary mb-4">
                Generate open-ended questions and get AI evaluation of your responses. Perfect for essay practice and deep understanding.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-foreground mb-2">"Explain the water cycle process"</div>
                <div className="text-foreground-secondary">
                  AI evaluates your answer for completeness, accuracy, and depth of understanding.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Your Complete Study Workflow
            </h2>
            <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
              From organizing your thoughts to mastering complex topics, Noted adapts to how you actually study.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Organize & Take Notes</h3>
              <p className="text-foreground-secondary text-sm">
                Create projects for each class. Organize notes in folders. Use our rich text editor with full formatting support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Ask Questions Instantly</h3>
              <p className="text-foreground-secondary text-sm">
                Type any question while studying. Press <span className="font-mono bg-gray-100 px-1 rounded">Cmd+Enter</span> for instant AI answers based on your content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Generate Study Materials</h3>
              <p className="text-foreground-secondary text-sm">
                Create flashcards, multiple choice quizzes, and free response questions from your notes with one click.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Study & Master</h3>
              <p className="text-foreground-secondary text-sm">
                Practice with your generated materials. Star favorites. Track progress with real-time feedback.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary-blue/10 to-primary-orange/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Library & Document Management</h3>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Upload PDFs, images, and documents to your personal library. Reference them in notes and include them when generating study materials for comprehensive coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="px-6 lg:px-8 py-20 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-orange rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">GP</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">A Note From Gene</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-border-light">
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-foreground">
                "I built Noted because I was tired of endless summaries that made studying feel passive. 
                I'd re-read the same notes over and over, hoping something would stick, but never feeling truly prepared."
              </p>
              
              <p className="text-foreground-secondary">
                The idea for the <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">Cmd+Enter</span> feature 
                came during a late-night study session when I realized: <em>"Instead of re-reading summaries, 
                what if I could just ask my notes a question and get an instant answer?"</em> That breakthrough became the heart of Noted.
              </p>
              
              <p className="text-foreground-secondary">
                Today, students use Noted to break free from summary fatigue. Instead of passive reading, 
                they actively engage with their material through questions, generated flashcards, and AI quizzes 
                that turn studying into real understanding.
              </p>
              
              <p className="text-foreground">
                "My goal is simple: make studying feel like having a conversation with your smartest friend 
                who knows exactly what you're learning."
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border-light">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-orange rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">GP</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Gene Park</div>
                  <div className="text-sm text-foreground-secondary">Founder & Developer, Noted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-16 bg-gradient-to-br from-primary-blue to-primary-orange">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Start studying smarter today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take notes, press <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">Cmd+Enter</span>, get answers. 
            It's that simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-white text-primary-blue hover:bg-gray-50 rounded-lg px-8 py-4 text-lg font-semibold flex items-center gap-2 shadow-lg"
              onClick={handleGetStarted}
            >
              Try Noted Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>No signup required to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-8 bg-foreground text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold">Noted</div>
              <p className="text-gray-400 text-sm">
                AI-powered note-taking that helps you study smarter
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it works</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Noted. Built with ❤️ for students who want to learn smarter.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}