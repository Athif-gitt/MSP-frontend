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
