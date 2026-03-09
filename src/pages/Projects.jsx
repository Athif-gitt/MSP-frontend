import { useProjects } from "../hooks/useProjects";

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load projects
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No projects yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {project.name}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {project.description || "No description"}
          </p>

          <div className="mt-4 text-xs text-gray-400">
            Created at {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;