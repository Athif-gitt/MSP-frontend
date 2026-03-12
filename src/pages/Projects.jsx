import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import PermissionGuard from "../components/PermissionGuard";
import { PERMISSIONS } from "../rbac/permissions";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const Projects = () => {
  const queryClient = useQueryClient();
  const { data: projects, isLoading, error } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || "Failed to create project");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || "Failed to update project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeDeleteDialog();
    },
    onError: (err) => {
      console.error(err);
      closeDeleteDialog();
    },
  });

  const openModal = (project = null) => {
    setFormError("");
    if (project) {
      setEditingProject(project);
      setFormData({ name: project.name, description: project.description || "" });
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ name: "", description: "" });
    setFormError("");
  };

  const openDeleteDialog = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Project name is required");
      return;
    }

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization's projects</p>
        </div>
        <PermissionGuard permission={PERMISSIONS.CREATE_PROJECT}>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </PermissionGuard>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading projects...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
          Failed to load projects. Please try again later.
        </div>
      ) : !projects?.length ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <p className="text-gray-500 mb-4">No projects found</p>
          <PermissionGuard permission={PERMISSIONS.CREATE_PROJECT}>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </button>
          </PermissionGuard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 pr-4">
                  {project.name}
                </h3>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                  <PermissionGuard permission={PERMISSIONS.EDIT_PROJECT}>
                    <button
                      onClick={() => openModal(project)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Project"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.DELETE_PROJECT}>
                    <button
                      onClick={() => openDeleteDialog(project)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </PermissionGuard>
                </div>
              </div>

              <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-6">
                {project.description || "No description provided."}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
                Created {new Date(project.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-colors text-sm"
                    placeholder="E.g., Website Redesign"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-colors text-sm min-h-[100px] resize-y"
                    placeholder="What is this project about?"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[100px]"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingProject ? (
                    "Save Changes"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeDeleteDialog}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Project
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;