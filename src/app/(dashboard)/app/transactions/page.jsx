"use client";

import AppPage from "@/app/components/AppPage";
import { PageLoader } from "@/app/components/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionsTable from "./TransactionsTable";

// ── Main Component ────────────────────────────────────────
export default function TransactionsPage() {
  const { data, isLoading } = useTransactions({
    query: {
      page: 0,
      size: 100,
    },
    payload: {
      populate: "user",
    },
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <AppPage>
      <TransactionsTable data={data} />
    </AppPage>
  );
}
