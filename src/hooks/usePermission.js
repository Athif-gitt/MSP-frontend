import { useCurrentUser } from "./useCurrentUser";
import { ROLE_PERMISSIONS } from "../rbac/permissions";

export const usePermission = () => {
    const { data: user, isLoading, isError } = useCurrentUser();

    // If loading or failed to fetch, effectively treat as no permissions
    if (isLoading || isError || !user) {
        return {
            hasPermission: () => false,
            isLoading,
        };
    }

    const userRole = user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    return { hasPermission, isLoading };
};
