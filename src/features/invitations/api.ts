import api from "../../services/api";

export interface InvitationData {
  organization_name: string;
  role: string;
  invited_by_email: string;
  email: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: string;
  organization_name: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
}

export interface OrganizationMember {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | string;
  created_at: string;
}

export const validateInvitation = async (token: string): Promise<InvitationData> => {
  const response = await api.get(`/organizations/invitations/validate/?token=${token}`);
  return response.data;
};

export const acceptInvitation = async (token: string): Promise<void> => {
  const response = await api.post(`/organizations/invitations/accept/`, { token });
  return response.data;
};

export const inviteMember = async (data: { email: string; role: string }): Promise<void> => {
  const response = await api.post(`/organizations/invite/`, data);
  return response.data;
};

export const listInvitations = async (): Promise<PendingInvitation[]> => {
  const response = await api.get("/organizations/invitations/");
  return response.data;
};

export const listMembers = async (): Promise<OrganizationMember[]> => {
  const response = await api.get("/organizations/members/");
  return response.data;
};
