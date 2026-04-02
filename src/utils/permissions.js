export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export function canDeleteTask(role) {
  return role === ROLES.OWNER || role === ROLES.ADMIN;
}

export function canRestoreTask(role) {
  return role === ROLES.OWNER || role === ROLES.ADMIN;
}

export function canViewTrash(role) {
  return role === ROLES.OWNER || role === ROLES.ADMIN;
}

export const getCurrentUserRole = (user, orgId) => {
  if (!user) return null;

  if (user.current_organization?.role) {
    const currentOrgId = user.current_organization.id;

    if (!orgId || String(currentOrgId) === String(orgId)) {
      return user.current_organization.role.toUpperCase();
    }
  }

  if (Array.isArray(user.organizations) && orgId) {
    const organization = user.organizations.find(
      (org) => String(org.id) === String(orgId)
    );

    if (organization?.role) {
      return organization.role.toUpperCase();
    }
  }

  if (Array.isArray(user.memberships) && orgId) {
    const membership = user.memberships.find(
      (m) => String(m.organization_id) === String(orgId)
    );

    if (membership?.role) {
      return membership.role.toUpperCase();
    }
  }

  return null;
};
