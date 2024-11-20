// app/[lang]/quotes/page.tsx

"use client";

import { useTranslations } from "@hooks/useTranslations";
import ProtectedRoute from "@components/protected-route/ProtectedRoute";
import { RoleKey } from "@utils/rolesDefinition";

export default function Management() {
  const { t, translations } = useTranslations();

  return (
    <ProtectedRoute
      allowedRoles={["quotes"] as RoleKey[]}
      mode="redirect"
      redirectPath="/"
      skeletonType="quotes"
    >
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.quotes.title)}
      </h1>
    </ProtectedRoute>
  );
}
