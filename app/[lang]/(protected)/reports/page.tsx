// app/[lang]/reports/page.tsx

"use client";

import { useTranslations } from "@hooks/useTranslations";
import ProtectedRoute from "@components/protected-route/ProtectedRoute";
import { RoleKey } from "@utils/rolesDefinition";

export default function Management() {
  const { t, translations } = useTranslations();

  return (
    <ProtectedRoute
      allowedRoles={["reports"] as RoleKey[]}
      mode="redirect"
      redirectPath="/"
      skeletonType="reports"
    >
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.reports.title)}
      </h1>
    </ProtectedRoute>
  );
}
