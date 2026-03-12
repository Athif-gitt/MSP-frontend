import React from "react";
import { usePermission } from "../hooks/usePermission";

const PermissionGuard = ({ permission, children, fallback = null }) => {
    const { hasPermission, isLoading } = usePermission();

    if (isLoading) {
        // Optionally return a subtle placeholder or null so layout doesn't jank
        return null;
    }

    if (!hasPermission(permission)) {
        return fallback;
    }

    return <>{children}</>;
};

export default PermissionGuard;
