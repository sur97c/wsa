// app/[lang]/global-error.tsx

"use client";

import ClientErrorPage from "@components/error/ClientErrorPage";
import { esTranslations } from "@translations/es-translations";
import { enTranslations } from "@translations/en-translations";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = window.location.pathname.split("/")[1] || "es";
  const translations = lang === "es" ? esTranslations : enTranslations;
  console.error(error, reset)

  return (
    <html>
      <body>
        <ClientErrorPage
          title={translations.errors.systemError.title}
          message={translations.errors.systemError.message}
          showBackButton={false}
          showHomeButton={true}
        />
      </body>
    </html>
  );
}
