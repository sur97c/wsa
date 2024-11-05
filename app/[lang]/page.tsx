// app/page.tsx
"use client";

import { useTranslations } from "@hooks/useTranslations";
import PageWrapper from "@components/page-wrapper/PageWrapper";
import BrokerDashboard from "@components/dashboards/BrokerDashboard";

export default function Home() {
  const { t, translations } = useTranslations();
  return (
    <PageWrapper transitionType="fade">
      {/* <h1 className="text-2xl font-bold mb-4">{t(translations.home.title)}</h1> */}
      <h1 className="text-2xl font-bold mb-4">{t(translations.home.brokerDashboard.title)}</h1>
      <BrokerDashboard></BrokerDashboard>
    </PageWrapper>
  );
}
