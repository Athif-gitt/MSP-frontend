import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { validateInvitation, acceptInvitation, inviteMember, InvitationData } from "./api";

export const useValidateInvitation = (token: string | null) => {
  return useQuery<InvitationData, Error>({
    queryKey: ["validateInvitation", token],
    queryFn: () => validateInvitation(token as string),
    enabled: !!token,
    retry: false, // Do not retry if the token is invalid or expired
  });
};

export const useAcceptInvitation = () => {
  return useMutation<void, Error, string>({
    mutationFn: (token: string) => acceptInvitation(token),
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { email: string; role: string }>({
    mutationFn: (data) => inviteMember(data),
    onSuccess: () => {
      // Invalidate members list if it exists to fetch new status
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
