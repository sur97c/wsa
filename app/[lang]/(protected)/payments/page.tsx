// app/[lang]/payments/page.tsx

"use client";

import { useTranslations } from "@hooks/useTranslations";
import ProtectedRoute from "@components/protected-route/ProtectedRoute";
import { RoleKey } from "@utils/rolesDefinition";

export default function Management() {
  const { t, translations } = useTranslations();

  return (
    <ProtectedRoute
      allowedRoles={["payments"] as RoleKey[]}
      mode="redirect"
      redirectPath="/"
      skeletonType="payments"
    >
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.payments.title)}
      </h1>
    </ProtectedRoute>
  );
}
