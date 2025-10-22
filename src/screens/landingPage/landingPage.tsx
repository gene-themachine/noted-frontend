import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Zap, CheckCircle, ArrowRight, FileText, Target, Command, Sparkles, Users } from "lucide-react";
import { ROUTES } from '@/utils/constants';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.REGISTER);
  };

  const colleges = [
    { name: 'Stanford', logo: '/stanford_logo.avif' },
    { name: 'Vanderbilt', logo: '/vanderbilt_logo.png' },
    { name: 'Dartmouth', logo: '/dartmouth_logo.png' },
    { name: 'Columbia', logo: '/columbia_logo.png' },
    { name: 'Brown', logo: '/brown_logo.png' },
  ];

  return (
    <div className="min-h-screen bg-home-background font-helvetica overflow-x-hidden">
      {/* Animated background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 h-20 px-6 lg:px-8 bg-home-background/90 backdrop-blur-md border-b border-border-light/50">
        <div className="flex items-center justify-between h-full w-full">
          <h1
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-foreground-secondary transition-colors duration-200"
            onClick={() => navigate(ROUTES.LANDING)}
          >
            Noted
          </h1>

          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <nav className="flex items-center gap-8">
              <a href="#features" className="text-foreground-secondary hover:text-foreground transition-all duration-200 hover:translate-y-[-2px]">Features</a>
            </nav>
          </div>

          <Button
            className="bg-foreground text-white hover:bg-foreground/90 rounded-lg px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* ============================================ */}
      {/* SECTION 1: HERO + VALUE PROPOSITION          */}
      {/* ============================================ */}

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-20 lg:py-24 pt-28 lg:pt-32 pb-32 lg:pb-40 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left column - Main heading */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-blue/10 to-primary-orange/10 border border-primary-blue/20 px-4 py-2 rounded-full mb-12">
                <Sparkles className="w-4 h-4 text-primary-blue" />
                <span className="text-primary-blue font-semibold text-sm">AI-POWERED STUDY PLATFORM</span>
              </div>

              {/* Main heading with creative spacing */}
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight mb-16">
                Take notes.
                <br />
                Ask questions.
                <br />
                Actually learn.
              </h1>

              {/* CTA Button */}
              <div className="mb-8">
                <Button
                  className="bg-primary-blue text-white hover:bg-hover-blue rounded-2xl px-12 py-7 text-xl font-semibold flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 outline-none ring-0 focus:outline-none focus:ring-0 border-0"
                  onClick={handleGetStarted}
                >
                  Start Learning Actively
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right column - Description with notebook feel */}
            <div className="lg:col-span-5 lg:pt-24">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-primary-blue/30 shadow-lg">
                {/* Grid background */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, #cbd5e1 0px, #cbd5e1 1px, transparent 1px, transparent 24px),
                      repeating-linear-gradient(90deg, #cbd5e1 0px, #cbd5e1 1px, transparent 1px, transparent 24px)
                    `,
                    backgroundSize: '24px 24px'
                  }}></div>
                </div>

                <div className="relative">
                  <p className="text-xl lg:text-2xl text-foreground-secondary mb-8 leading-relaxed">
                    Stop re-reading endless summaries. Take notes, get AI autocomplete as you type, and press{' '}
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-foreground px-2 py-1 rounded font-mono text-sm font-medium">
                      <Command className="w-3 h-3" />
                      Enter
                    </span>
                    {' '}for instant answers to any question.
                  </p>

                  <p className="text-lg text-foreground-tertiary leading-relaxed">
                    Turn your content into flashcards and quizzes for active learning that actually sticks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Demo/Mockup Section with colored background */}
          <div className="max-w-5xl mx-auto mt-20">
            <div className="relative">
              {/* Colored glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/30 to-primary-orange/30 rounded-3xl blur-3xl transform scale-105"></div>

              {/* Demo Window */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-border-light">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-foreground-secondary font-medium">My Notes - Biology</span>
                  </div>
                </div>

                <div className="p-10 lg:p-12">
                  <div className="space-y-6">
                    {/* Sample note content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-foreground">Cell Structure & Function</h3>
                      <p className="text-foreground-secondary leading-relaxed">
                        The mitochondria are known as the powerhouse of the cell. They produce ATP through cellular respiration,
                        converting nutrients into energy that the cell can use for various processes.
                      </p>
                    </div>

                    {/* Question example with blue accent */}
                    <div className="bg-gradient-to-r from-primary-blue/10 to-primary-blue/5 border-l-4 border-primary-blue p-5 rounded-r-2xl hover:from-primary-blue/15 hover:to-primary-blue/10 transition-colors duration-300">
                      <p className="text-foreground font-semibold text-lg mb-3">What is the role of mitochondria?</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-foreground px-2 py-1 rounded font-mono text-xs font-medium">
                          <Command className="w-3 h-3" />
                          Enter
                        </span>
                        <span className="text-sm text-primary-blue font-medium">Press to get instant answer</span>
                      </div>
                    </div>

                    {/* AI Answer with green accent */}
                    <div className="bg-gradient-to-r from-primary-green/10 to-primary-green/5 border-l-4 border-primary-green p-5 rounded-r-2xl hover:from-primary-green/15 hover:to-primary-green/10 transition-colors duration-300">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary-green uppercase tracking-wide mb-2">AI Answer</p>
                          <p className="text-foreground leading-relaxed">
                            Mitochondria serve as the cell's power generators, producing ATP through cellular respiration.
                            They convert nutrients into usable energy for cellular processes.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-11">
                        <CheckCircle className="w-4 h-4 text-primary-green" />
                        <span className="text-xs text-primary-green font-medium">Generated from your notes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section with colored background */}
      <section className="px-6 lg:px-8 py-20 bg-gradient-to-b from-home-background via-primary-blue/3 to-home-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-foreground-tertiary uppercase tracking-wider mb-10 animate-fade-in-up">
              Trusted by students at
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 items-center justify-items-center">
              {colleges.map((college, index) => (
                <div
                  key={college.name}
                  className="group relative w-full flex items-center justify-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={college.logo}
                    alt={`${college.name} logo`}
                    className="h-12 lg:h-16 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 filter group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: CORE FEATURES                     */}
      {/* ============================================ */}

      {/* CMD+Enter Feature Spotlight with orange accent */}
      <section id="features" className="px-6 lg:px-8 py-24 relative overflow-hidden bg-gradient-to-br from-home-background via-primary-orange/3 to-home-background">
        {/* Floating shape */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl animate-float"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-primary-blue to-primary-blue/80 text-white px-5 py-2.5 rounded-full mb-6 shadow-lg hover:scale-105 transition-transform duration-300">
              <Command className="w-4 h-4" />
              <span className="font-semibold text-sm">Signature Feature</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Notes, <span className="relative inline-block">Your Questions
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-blue/20 -z-10 transform -rotate-1"></div>
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
              After taking notes in class, type any question directly in your notes and press{' '}
              <span className="inline-flex items-center gap-1 bg-gray-100 text-foreground px-2 py-1 rounded font-mono text-xs font-medium">
                <Command className="w-3 h-3" />
                Enter
              </span>{' '}
              for instant AI answers based on what you wrote.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden max-w-4xl mx-auto transform hover:scale-[1.02] transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm text-foreground-secondary font-medium">Biology Notes - Chapter 3</span>
              </div>
            </div>
            <div className="p-8 lg:p-10">
              <div className="space-y-6">
                <div className="text-foreground-tertiary text-sm font-medium uppercase tracking-wide">Your question:</div>
                <div className="bg-gradient-to-r from-primary-blue/10 to-primary-blue/5 border-l-4 border-primary-blue p-5 rounded-r-2xl">
                  <p className="text-foreground font-semibold text-lg">What is the difference between mitosis and meiosis?</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-foreground px-2 py-1 rounded font-mono text-xs font-medium">
                      <Command className="w-3 h-3" />
                      Enter
                    </span>
                    <span className="text-xs text-primary-blue font-medium">pressed</span>
                  </div>
                </div>
                <div className="text-foreground-tertiary text-sm font-medium uppercase tracking-wide">AI Answer:</div>
                <div className="bg-gradient-to-r from-primary-green/10 to-primary-green/5 border-l-4 border-primary-green p-5 rounded-r-2xl">
                  <p className="text-foreground leading-relaxed">Based on your notes, mitosis produces two identical diploid cells for growth and repair, while meiosis creates four genetically diverse haploid gametes for reproduction. Key differences include chromosome number reduction and genetic recombination in meiosis.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <CheckCircle className="w-4 h-4 text-primary-green" />
                    <span className="text-xs text-primary-green font-medium">Answer generated from your notes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Learning Philosophy Section */}
      <section className="px-6 lg:px-8 py-24 bg-gradient-to-b from-home-background via-primary-yellow/3 to-home-background relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-0 w-80 h-80 bg-primary-orange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary-orange/10 border border-primary-orange/20 px-4 py-2 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-primary-orange" />
              <span className="text-primary-orange font-semibold text-sm">The Active Learning Difference</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Stop Summarizing PDFs.
              <br />
              <span className="relative inline-block">Start Taking Notes.
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-orange/20 -z-10 transform rotate-1"></div>
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed mb-8">
              Dragging and dropping PDFs for instant summaries is passive consumption—you don't retain anything.
              Noted flips this: you actively take notes in class, engage with the material firsthand, then AI transforms
              <em> your work</em> into personalized study tools. That's how you actually learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Flashcards */}
            <div className="bg-primary-blue rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group animate-fade-in-up hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-white mb-3">Smart Flashcards</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Automatically generate flashcards from your notes with spaced repetition. Star favorites and track your progress as you study.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-sm border border-white/20">
                <div className="font-semibold text-white mb-2">Front: "What causes photosynthesis?"</div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-3"></div>
                <div className="text-white/80">Back: "Light energy + CO₂ + H₂O → glucose + O₂"</div>
              </div>
            </div>

            {/* Multiple Choice Quizzes */}
            <div className="bg-primary-orange rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group animate-fade-in-up hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold text-white mb-3">Multiple Choice Quizzes</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Create challenging multiple choice questions with instant feedback. Perfect for exam preparation and knowledge testing.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-sm border border-white/20">
                <div className="font-semibold text-white mb-3">"Which organelle produces ATP?"</div>
                <div className="space-y-2 text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
                    <span>A) Nucleus</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary-green" />
                    </div>
                    <span>B) Mitochondria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
                    <span>C) Ribosome</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Response Practice */}
            <div className="bg-primary-green rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group animate-fade-in-up hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-white mb-3">Free Response Practice</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Generate open-ended questions and get AI evaluation of your responses. Perfect for essay practice and deep understanding.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-sm border border-white/20">
                <div className="font-semibold text-white mb-3">"Explain the water cycle process"</div>
                <div className="text-white/80 text-xs leading-relaxed">
                  AI evaluates your answer for completeness, accuracy, and depth of understanding.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: CTA                               */}
      {/* ============================================ */}

      {/* CTA Section with gradient background */}
      <section className="px-6 lg:px-8 py-20 bg-gradient-to-br from-primary-blue/10 via-home-background to-primary-orange/10 relative overflow-hidden">
        {/* Animated shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-orange/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
            Ready to <span className="relative inline-block">learn actively?
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-blue/30 -z-10 transform -rotate-1"></div>
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-foreground-secondary mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Take notes in class. Engage with your material. Let AI transform your work into powerful study tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button
              className="bg-primary-blue text-white hover:bg-hover-blue rounded-2xl px-10 py-6 text-lg font-bold flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              onClick={handleGetStarted}
            >
              Try Noted Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 bg-home-background border-t border-border-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-orange rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Noted</div>
                <p className="text-foreground-secondary text-sm">
                  AI-powered note-taking that helps you study smarter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#features" className="text-foreground-secondary hover:text-foreground transition-all duration-200 hover:translate-y-[-2px]">Features</a>
            </div>
          </div>
          <div className="border-t border-border-light/30 pt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              &copy; 2025 Noted. Built with care for students who want to learn smarter.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
