"use client";

import AppPage from "@/app/components/AppPage";
import { PageLoader } from "@/app/components/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import AgentsTable from "./AgentsTable";
import { useStudents } from "@/hooks/useStudent";

// ── Main Component ────────────────────────────────────────
export default function Page() {
  const { data, isLoading } = useStudents({
    query: {
      page: 0,
      size: 100,
      role: "AGENT",
    },
    payload: {},
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <AppPage title={"Students"}>
      <AgentsTable data={data} />
    </AppPage>
  );
}
