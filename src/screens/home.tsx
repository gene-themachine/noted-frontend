import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, useCreateProject } from "@/hooks/project";
import { Project } from "@/types/index";
import ProjectCard from "@/components/project/projectCard";
import StartWorkflow from '@/components/startWorkflow';
import AddProjectModal from '@/components/modals/addProjectModal';
import { PROJECT_CONSTANTS } from '@/utils/constants';

export default function HomePage() {
  const { data: projects = [], isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleCreateProject = async (name: string, description: string, color: string) => {
    setIsCreating(true);
    try {
      await createProjectMutation.mutateAsync({
        name,
        description,
        color,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
      // Scroll to the end to show the new project
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      }
    }
  };

  const getProjectColor = (index: number) => {
    return PROJECT_CONSTANTS.colors[index % PROJECT_CONSTANTS.colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-home-background flex items-center justify-center">
        <div className="text-2xl font-medium text-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-home-background flex items-center justify-center">
        <div className="text-2xl font-medium text-status-error">Error loading projects</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow max-w-9xl mx-auto w-full">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-6 lg:px-8">
        <StartWorkflow />
      </div>

      {/* Horizontally Scrollable Project Cards */}
      <div className="relative pb-8">
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        <div 
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto space-x-6 px-6 lg:px-12 py-6 hide-scrollbar"
        >
          {projects.length > 0 && projects.map((project: Project, index: number) => (
            <ProjectCard
              key={project.id}
              project={project}
              colorClass={getProjectColor(index)}
              onClick={() => navigate(`/project/${project.id}`)}
            />
          ))}
        </div>

        {/* Floating Add Button */}
        <div className="absolute right-6 lg:right-8 bottom-18 z-floating">
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-surface/90 backdrop-blur-md border border-border-light text-foreground-secondary hover:bg-surface hover:text-foreground shadow-floating hover:shadow-floating-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              variant="ghost"
              onClick={() => setIsModalOpen(true)}
              disabled={isCreating}
              aria-label="Add new project"
            >
              {isCreating ? (
                <div className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-7 h-7 transition-transform duration-200 group-hover:scale-110" />
              )}
            </Button>
        </div>
      </div>
      
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        theme="light"
      />
    </div>
  );
}
