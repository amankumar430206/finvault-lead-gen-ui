"use client";

import AppPage from "@/app/components/AppPage";
import { PageLoader } from "@/app/components/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import StudentsTable from "./StudentsTable";
import { useStudents } from "@/hooks/useStudent";

// ── Main Component ────────────────────────────────────────
export default function TransactionsPage() {
  const { data, isLoading } = useStudents({
    query: {
      page: 0,
      size: 100,
      role: "STUDENT",
      populate: "passport pan",
    },
    payload: {},
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <AppPage title={"Students"}>
      <StudentsTable data={data} />
    </AppPage>
  );
}
