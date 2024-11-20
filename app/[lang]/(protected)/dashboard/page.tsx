// app/[lang]/clients/page.tsx

"use client";

import { useTranslations } from "@hooks/useTranslations";
import ProtectedRoute from "@components/protected-route/ProtectedRoute";
import { RoleKey } from "@utils/rolesDefinition";
import BrokerDashboard from "@components/dashboards/BrokerDashboard";

export default function Dashboard() {
  const { t, translations } = useTranslations();

  return (
    <ProtectedRoute
      allowedRoles={["clients"] as RoleKey[]}
      mode="redirect"
      redirectPath="/"
      skeletonType="dashboard"
    >
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.dashboard.title)}
      </h1>

      <BrokerDashboard />
    </ProtectedRoute>
  );
}
