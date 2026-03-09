import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/projectService";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};