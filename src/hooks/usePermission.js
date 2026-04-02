import { useCurrentUser } from "./useCurrentUser";
import { ROLE_PERMISSIONS } from "../rbac/permissions";
import { getOrgId } from "../utils/authStore";
import { getCurrentUserRole } from "../utils/permissions";

export const usePermission = () => {
    const { data: user, isLoading, isError } = useCurrentUser();

    // If loading or failed to fetch, effectively treat as no permissions
    if (isLoading || isError || !user) {
        return {
            hasPermission: () => false,
            isLoading,
        };
    }

    const currentOrgId = getOrgId();
    const userRole = getCurrentUserRole(user, currentOrgId);
    
    // If no role found within this org, deny implicitly
    if (!userRole) {
        return { hasPermission: () => false, isLoading: false };
    }

    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    return { hasPermission, isLoading };
};
