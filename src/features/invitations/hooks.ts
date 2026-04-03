import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateInvitation,
  acceptInvitation,
  inviteMember,
  listInvitations,
  listMembers,
  InvitationData,
  PendingInvitation,
  OrganizationMember,
} from "./api";

export const MEMBERS_QUERY_KEY = ["members"];
export const INVITATIONS_QUERY_KEY = ["invitations"];

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
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
  });
};

export const useInvitations = (enabled = true) => {
  return useQuery<PendingInvitation[], Error>({
    queryKey: INVITATIONS_QUERY_KEY,
    queryFn: listInvitations,
    enabled,
  });
};

export const useMembers = () => {
  return useQuery<OrganizationMember[], Error>({
    queryKey: MEMBERS_QUERY_KEY,
    queryFn: listMembers,
  });
};
