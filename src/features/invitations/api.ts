import api from "../../services/api";

export interface InvitationData {
  organization_name: string;
  role: string;
  invited_by_email: string;
  email: string;
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
