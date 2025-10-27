import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/project";
import { Project } from "@/types/index";
import ProjectCard from "@/components/project/projectCard";
import AddProjectModal from '@/components/modals/addProjectModal';
import EditProjectModal from '@/components/modals/EditProjectModal';
import DeleteProjectModal from '@/components/modals/DeleteProjectModal';
import { PROJECT_CONSTANTS } from '@/utils/constants';

export default function HomePage() {
  const { data: projects = [], isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Set page title
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (name: string, description: string, color: string) => {
    if (!selectedProject) return;

    try {
      await updateProjectMutation.mutateAsync({
        id: selectedProject.id,
        data: { name, description, color },
      });
      setIsEditModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await deleteProjectMutation.mutateAsync(selectedProject.id);
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
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
    <div className="relative w-full flex-grow">
      {/* Center Blue Circle - Fixed positioning for true centering */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => setIsComingSoonModalOpen(true)}
          className="w-56 h-56 rounded-full bg-primary-blue hover:bg-hover-blue shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-blue focus:ring-offset-4"
          aria-label="New feature"
        >
        </button>
      </div>

      {/* Bottom Section - Project Cards + Add Button */}
      <div className="absolute bottom-8 left-0 right-0">
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
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto space-x-6 px-12 py-6 hide-scrollbar"
          >
            {projects.length > 0 && projects.map((project: Project, index: number) => (
              <ProjectCard
                key={project.id}
                project={project}
                colorClass={getProjectColor(index)}
                onClick={() => navigate(`/project/${project.id}`)}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project)}
              />
            ))}
          </div>

          {/* Floating Add Button */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isCreating}
              className="w-20 h-20 rounded-3xl bg-foreground text-white hover:bg-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
              aria-label="Add new project"
            >
              {isCreating ? (
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-10 h-10 stroke-[3]" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        theme="light"
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProject}
        project={selectedProject}
        isUpdating={updateProjectMutation.isPending}
        theme="light"
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmDelete}
        projectName={selectedProject?.name || ''}
        isDeleting={deleteProjectMutation.isPending}
        theme="light"
      />

      {/* Coming Soon Modal */}
      {isComingSoonModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              New Feature Coming Soon!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We're working on something exciting. Stay tuned!
            </p>
            <button
              onClick={() => setIsComingSoonModalOpen(false)}
              className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-hover-blue transition-all duration-200 font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
