export const ROLES = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
};

export const PERMISSIONS = {
    // Project Permissions
    CREATE_PROJECT: "create_project",
    EDIT_PROJECT: "edit_project",
    DELETE_PROJECT: "delete_project",
    VIEW_PROJECT: "view_project",

    // Member Management
    INVITE_MEMBER: "invite_member",
    REMOVE_MEMBER: "remove_member",
    CHANGE_MEMBER_ROLE: "change_member_role",

    // Task Management
    CREATE_TASK: "create_task",
    EDIT_TASK: "edit_task",
    DELETE_TASK: "delete_task",
    ASSIGN_TASK: "assign_task",
};

export const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: [
        // Owner has full access to everything
        PERMISSIONS.CREATE_PROJECT,
        PERMISSIONS.EDIT_PROJECT,
        PERMISSIONS.DELETE_PROJECT,
        PERMISSIONS.VIEW_PROJECT,

        PERMISSIONS.INVITE_MEMBER,
        PERMISSIONS.REMOVE_MEMBER,
        PERMISSIONS.CHANGE_MEMBER_ROLE,

        PERMISSIONS.CREATE_TASK,
        PERMISSIONS.EDIT_TASK,
        PERMISSIONS.DELETE_TASK,
        PERMISSIONS.ASSIGN_TASK,
    ],
    [ROLES.ADMIN]: [
        // Admins can manage projects, members, and tasks (but typically lack destructive organization-level powers)
        PERMISSIONS.CREATE_PROJECT,
        PERMISSIONS.EDIT_PROJECT,
        PERMISSIONS.DELETE_PROJECT,
        PERMISSIONS.VIEW_PROJECT,

        PERMISSIONS.INVITE_MEMBER,

        PERMISSIONS.CREATE_TASK,
        PERMISSIONS.EDIT_TASK,
        PERMISSIONS.DELETE_TASK,
        PERMISSIONS.ASSIGN_TASK,
    ],
    [ROLES.MEMBER]: [
        // Members can primarily view projects and manage tasks
        PERMISSIONS.VIEW_PROJECT,

        PERMISSIONS.CREATE_TASK,
        PERMISSIONS.EDIT_TASK,
        PERMISSIONS.ASSIGN_TASK,
    ],
};
