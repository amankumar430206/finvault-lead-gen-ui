import React from "react";

import {
  AlertBanner,
  Badge,
  PaymentCard,
  ProgressBar,
  Sparkline,
  StatCard,
  TransactionTable,
  Widget,
} from "@/app/components/common";
import AppPage from "@/app/components/AppPage";

// ═══════════════════════════════════════════════════════════
//  DEMO PAGE — shows everything in action
// ═══════════════════════════════════════════════════════════
const DEMO_TXN = [
  {
    name: "TXN-9F3K2A7D",
    category: "Revenue",
    date: "Feb 24",
    amount: 4200,
    status: "completed",
  },
  {
    name: "TXN-4L8M1Q2X",
    category: "Cloud",
    date: "Feb 23",
    amount: -890,
    status: "completed",
  },
  {
    name: "TXN-7Z5P0N3C",
    category: "HR",
    date: "Feb 22",
    amount: -12400,
    status: "pending",
  },
  {
    name: "TXN-2B6D9W1H",
    category: "Refund",
    date: "Feb 21",
    amount: -150,
    status: "completed",
  },
  {
    name: "TXN-8J4T6R0K",
    category: "Transfer",
    date: "Feb 20",
    amount: 3100,
    status: "failed",
  },
];

const SPARK = [18, 24, 20, 28, 22, 30, 27, 35, 32, 38, 34, 42];

const Page = () => {
  return (
    <AppPage
      title="Overview"
      description="Your financial dashboard at a glance. Track revenue, expenses, and key metrics in one place."
    >
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Transfers" value="42" change={20} icon="trending" iconColor="emerald" />
        <StatCard label="Transfers Pending" value="8" change={-3} icon="file" iconColor="rose" />
        <StatCard label="Transfers Rejected" value="2" change={15} icon="file" iconColor="rose" />
        <StatCard label="Awaiting Bank" value="0" change={0} icon="file" iconColor="rose" />
      </div>

      {/* ── Second Row ── */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Transactions */}
        <TransactionTable transactions={DEMO_TXN} />

        {/* Side widgets */}
        <div className="flex flex-col gap-4"></div>
      </div>
    </AppPage>
  );
};

export default Page;
