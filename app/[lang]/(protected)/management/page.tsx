// app/[lang]/management/page.tsx

"use client";

import UserManagement from "@app/[lang]/(protected)/management/user-management/UserManagement";
import ProtectedRoute from "@components/protected-route/ProtectedRoute";
import { RoleKey } from "@utils/rolesDefinition";

export default function Management() {
  return (
    <ProtectedRoute
      allowedRoles={["management"] as RoleKey[]}
      mode="redirect"
      redirectPath="/"
      skeletonType="management"
    >
      <UserManagement />
    </ProtectedRoute>
  );
}
