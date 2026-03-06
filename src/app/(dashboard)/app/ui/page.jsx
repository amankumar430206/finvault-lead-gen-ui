"use client";

import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  DropdownMenu,
  EmptyState,
  Input,
  Modal,
  ProgressBar,
  RadioGroup,
  SearchInput,
  Select,
  Skeleton,
  Slider,
  StatCard,
  Table,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
} from "@/app/components/ui";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Section label helper (internal)
// ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <p className="text-primary/70 font-semibold text-sm tracking-tight">{children}</p>
    <div className="flex-1 h-px bg-inputbg" />
  </div>
);

// ═══════════════════════════════════════════════════════════
// DEMO KITCHEN SINK
// ═══════════════════════════════════════════════════════════
export default function ComponentLibrary() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [pillTab, setPillTab] = useState("all");
  const [radio, setRadio] = useState("standard");
  const [select, setSelect] = useState("");
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [slider, setSlider] = useState(42);
  const [inputVal, setInputVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [textVal, setTextVal] = useState("");
  const [chips, setChips] = useState(["React", "Tailwind", "Fintech"]);
  const [loading, setLoading] = useState(false);

  const triggerLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  const tableColumns = [
    { key: "name", label: "Name" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <Badge variant={v === "Active" ? "success" : v === "Pending" ? "warning" : "danger"} dot>
          {v}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (v) => <span className="font-mono text-accent">{v}</span>,
    },
    { key: "date", label: "Date", render: (v) => <span className="text-primary/40">{v}</span> },
  ];
  const tableRows = [
    { name: "Stripe Payout", status: "Active", amount: "$4,200.00", date: "Feb 24, 2026" },
    { name: "AWS Invoice", status: "Pending", amount: "$890.00", date: "Feb 23, 2026" },
    { name: "Payroll Run", status: "Active", amount: "$12,400.00", date: "Feb 22, 2026" },
    { name: "Wise Transfer", status: "Failed", amount: "$3,100.00", date: "Feb 20, 2026" },
  ];

  return (
    <div className="min-h-screen bg-base text-primary p-6 md:p-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b  border-[var(--border-clr)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-primary font-bold text-sm shadow-md shadow-emerald-500/30">
            F
          </div>
          <h1 className="text-primary text-2xl font-semibold tracking-tight">FinVault UI</h1>
          <Badge variant="info">v1.0</Badge>
        </div>
        <p className="text-primary/50 text-sm mt-1">
          25 components · Dark fintech theme · Tailwind CSS · Zero dependencies
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            "Button",
            "Input",
            "Textarea",
            "Select",
            "Radio",
            "Checkbox",
            "Toggle",
            "Badge",
            "Modal",
            "Alert",
            "Tooltip",
            "Tabs",
            "Table",
            "Avatar",
            "Progress",
            "Slider",
            "Card",
            "Dropdown",
            "Search",
            "StatCard",
            "Empty",
            "Skeleton",
            "Divider",
            "Chip",
          ].map((c) => (
            <span
              key={c}
              className="text-[10px] font-medium font-mono text-primary/50 bg-inputbg border  border-[var(--border-clr)] px-2 py-0.5 rounded-md"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 max-w-4xl">
        {/* BUTTONS */}
        <section>
          <SectionLabel>Button</SectionLabel>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button loading={loading} onClick={triggerLoad}>
              {loading ? "Loading…" : "Click to Load"}
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="primary" rightIcon="→">
              With Icon
            </Button>
            <Button variant="outline" leftIcon="⬆">
              Upload
            </Button>
            <Button variant="primary" fullWidth>
              Full Width
            </Button>
          </div>
        </section>

        <Divider />

        {/* INPUTS */}
        <section>
          <SectionLabel>Input Fields</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              hint="We'll never share your email."
            />
            <Input label="Amount" placeholder="0.00" prefix="$" suffix="USD" value="" onChange={() => {}} />
            <Input
              label="Valid field"
              placeholder="Looks good!"
              success="Verified ✓"
              value="jane@finvault.io"
              onChange={() => {}}
            />
            <Input
              label="Error field"
              placeholder="Required"
              error="This field is required."
              value=""
              onChange={() => {}}
            />
            <Input label="Disabled" placeholder="Cannot edit" disabled value="readonly value" onChange={() => {}} />
            <SearchInput
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onClear={() => setSearchVal("")}
              placeholder="Search transactions…"
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Notes"
              placeholder="Add a note…"
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              maxLength={200}
              hint="Optional — used for internal reference."
            />
          </div>
        </section>

        <Divider />

        {/* SELECT */}
        <section>
          <SectionLabel>Select</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Account type"
              value={select}
              onChange={setSelect}
              placeholder="Choose account type"
              options={[
                { value: "checking", label: "Checking Account" },
                { value: "savings", label: "Savings Account" },
                { value: "business", label: "Business Account" },
                { value: "crypto", label: "Crypto Wallet", disabled: true },
              ]}
              hint="Select your primary account type."
            />
            <Select
              label="Currency"
              value=""
              onChange={() => {}}
              placeholder="Select currency"
              options={[
                { value: "usd", label: "USD — US Dollar" },
                { value: "eur", label: "EUR — Euro" },
                { value: "gbp", label: "GBP — British Pound" },
                { value: "inr", label: "INR — Indian Rupee" },
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* RADIO */}
        <section>
          <SectionLabel>Radio Group</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RadioGroup
              label="Transfer speed"
              value={radio}
              onChange={setRadio}
              options={[
                { value: "instant", label: "Instant", description: "Arrives in seconds. Fee: 1.5%" },
                { value: "standard", label: "Standard", description: "1–2 business days. Fee: 0.3%" },
                { value: "slow", label: "Economy", description: "3–5 business days. Fee: Free" },
              ]}
            />
            <RadioGroup
              label="Plan tier"
              value="pro"
              onChange={() => {}}
              orientation="vertical"
              options={[
                { value: "free", label: "Free", description: "Up to $1,000/mo" },
                { value: "pro", label: "Pro", description: "Up to $50,000/mo" },
                { value: "enterprise", label: "Enterprise", description: "Unlimited", disabled: true },
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* CHECKBOX + TOGGLE */}
        <section>
          <SectionLabel>Checkbox & Toggle</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Checkbox
                label="Enable 2FA"
                description="Secure your account with two-factor authentication."
                checked={check1}
                onChange={setCheck1}
              />
              <Checkbox
                label="Email notifications"
                description="Receive alerts for every transaction."
                checked={check2}
                onChange={setCheck2}
              />
              <Checkbox
                label="Disabled option"
                description="This cannot be changed right now."
                checked
                disabled
                onChange={() => {}}
              />
            </div>
            <div className="flex flex-col gap-5">
              <Toggle
                label="Dark mode"
                description="Always enabled for this theme."
                checked={true}
                onChange={() => {}}
                disabled
              />
              <Toggle
                label="Transaction alerts"
                description="Push notifications for incoming funds."
                checked={toggle1}
                onChange={setToggle1}
              />
              <Toggle
                label="Auto-reconcile"
                description="Match transactions automatically each day."
                checked={toggle2}
                onChange={setToggle2}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* SLIDER */}
        <section>
          <SectionLabel>Slider</SectionLabel>
          <div className="max-w-sm flex flex-col gap-5">
            <Slider
              label="Transfer limit"
              value={slider}
              onChange={setSlider}
              min={0}
              max={100}
              prefix="$"
              suffix="K"
            />
            <Slider label="Risk tolerance" value={70} onChange={() => {}} min={0} max={100} suffix="%" />
          </div>
        </section>

        <Divider />

        {/* TABS */}
        <section>
          <SectionLabel>Tabs</SectionLabel>
          <div className="flex flex-col gap-6">
            <div>
              <Tabs
                variant="underline"
                activeTab={tab}
                onChange={setTab}
                tabs={[
                  { id: "overview", label: "Overview", badge: "12" },
                  { id: "transactions", label: "Transactions" },
                  { id: "analytics", label: "Analytics" },
                  { id: "settings", label: "Settings" },
                ]}
              />
              <p className="mt-3 text-primary/50 text-xs">
                Active: <span className="text-accent">{tab}</span>
              </p>
            </div>
            <Tabs
              variant="pill"
              activeTab={pillTab}
              onChange={setPillTab}
              tabs={[
                { id: "all", label: "All" },
                { id: "income", label: "Income" },
                { id: "expenses", label: "Expenses" },
                { id: "pending", label: "Pending" },
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* BADGES + CHIPS */}
        <section>
          <SectionLabel>Badge & Chip</SectionLabel>
          <div className="flex flex-wrap gap-2 mb-4">
            {["default", "success", "warning", "danger", "info", "violet"].map((v) => (
              <Badge key={v} variant={v} dot>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <Chip
                key={c}
                label={c}
                color={i === 0 ? "emerald" : i === 1 ? "blue" : "default"}
                onRemove={() => setChips((p) => p.filter((_, j) => j !== i))}
              />
            ))}
            <Chip label="+ Add tag" />
          </div>
        </section>

        <Divider />

        {/* ALERTS */}
        <section>
          <SectionLabel>Alert</SectionLabel>
          <div className="flex flex-col gap-3">
            <Alert
              type="info"
              title="KYC Required"
              message="Please complete identity verification to unlock higher transfer limits."
              onClose={() => {}}
            />
            <Alert
              type="success"
              title="Payment Sent"
              message="Your transfer of $4,200 to Stripe was processed successfully."
              onClose={() => {}}
            />
            <Alert
              type="warning"
              title="Limit Approaching"
              message="You've used 87% of your monthly transfer allowance."
              onClose={() => {}}
            />
            <Alert
              type="danger"
              title="Transfer Failed"
              message="Wise transfer #W-8821 failed due to insufficient funds."
              onClose={() => {}}
            />
          </div>
        </section>

        <Divider />

        {/* PROGRESS */}
        <section>
          <SectionLabel>Progress Bar</SectionLabel>
          <div className="flex flex-col gap-3 max-w-md">
            <ProgressBar label="Marketing Budget" value={68} max={100} color="emerald" showValue />
            <ProgressBar label="Engineering" value={82} max={100} color="blue" showValue />
            <ProgressBar label="Operations" value={45} max={100} color="violet" showValue />
            <ProgressBar label="Sales Target" value={91} max={100} color="amber" showValue />
            <ProgressBar label="Syncing…" value={60} max={100} color="cyan" animated size="sm" />
          </div>
        </section>

        <Divider />

        {/* TABLE */}
        <section>
          <SectionLabel>Table</SectionLabel>
          <Table columns={tableColumns} rows={tableRows} onRowClick={(r) => console.log("Row:", r)} />
        </section>

        <Divider />

        {/* AVATARS */}
        <section>
          <SectionLabel>Avatar</SectionLabel>
          <div className="flex items-end gap-6 flex-wrap">
            <div className="flex items-end gap-3">
              <Avatar name="Jane Doe" size="xs" status="online" />
              <Avatar name="John Smith" size="sm" status="busy" />
              <Avatar name="Alice Wang" size="md" status="away" />
              <Avatar name="Bob Marley" size="lg" status="offline" />
              <Avatar name="Clara Kent" size="xl" />
            </div>
            <div>
              <p className="text-primary/50 text-xs uppercase tracking-wider mb-2">Group</p>
              <AvatarGroup names={["Jane D", "John S", "Alice W", "Bob M", "Clara K", "Dev T"]} max={4} />
            </div>
          </div>
        </section>

        <Divider />

        {/* CARDS */}
        <section>
          <SectionLabel>Card</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card title="Default Card" subtitle="Standard container">
              <p className="text-primary/40 text-sm">Card body content. Use for any grouped information.</p>
            </Card>
            <Card title="Accent Card" subtitle="Top highlight" accent>
              <p className="text-primary/40 text-sm">This card has an emerald top accent to draw focus.</p>
            </Card>
            <Card
              title="Hoverable"
              subtitle="Clickable feel"
              hover
              footer={
                <Button size="sm" variant="outline" fullWidth>
                  View details
                </Button>
              }
            >
              <p className="text-primary/40 text-sm">Hover to see border brighten effect.</p>
            </Card>
          </div>
        </section>

        <Divider />

        {/* STAT CARDS */}
        <section>
          <SectionLabel>Stat Card</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value="$142K" change={12.4} icon="💰" color="emerald" />
            <StatCard label="Expenses" value="$38K" change={-3.1} icon="📉" color="amber" />
            <StatCard label="Active Cards" value="24" change={8.0} icon="💳" color="blue" />
            <StatCard label="Customers" value="3,812" change={5.7} icon="👥" color="violet" />
          </div>
        </section>

        <Divider />

        {/* TOOLTIP + DROPDOWN */}
        <section>
          <SectionLabel>Tooltip & Dropdown</SectionLabel>
          <div className="flex items-center gap-6 flex-wrap">
            <Tooltip text="Verified account — KYC complete">
              <Button variant="outline">Hover for tooltip</Button>
            </Tooltip>
            <Tooltip text="Transfer limit: $50K/month" position="right">
              <Badge variant="info" dot>
                Hover badge
              </Badge>
            </Tooltip>
            <DropdownMenu
              trigger={<Button variant="secondary">Actions ▾</Button>}
              items={[
                { label: "View details", icon: "◉", shortcut: "⌘V" },
                { label: "Edit record", icon: "✎", shortcut: "⌘E" },
                { label: "Export CSV", icon: "↓", shortcut: "⌘S" },
                { divider: true },
                { label: "Delete", icon: "✕", danger: true },
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* SKELETON + EMPTY */}
        <section>
          <SectionLabel>Skeleton & Empty State</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3 p-5 bg-card2 rounded-2xl border  border-[var(--border-clr)]">
              <Skeleton height="h-4" width="55%" />
              <Skeleton height="h-3" />
              <Skeleton height="h-3" width="75%" />
              <Skeleton height="h-10" rounded="rounded-xl" />
            </div>
            <div className="bg-card2 rounded-2xl border  border-[var(--border-clr)]">
              <EmptyState
                icon="◎"
                title="No transactions yet"
                description="Once you make a transfer it will appear here."
                action={<Button size="sm">Make a transfer</Button>}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* MODAL */}
        <section>
          <SectionLabel>Modal</SectionLabel>
          <Button onClick={() => setModalOpen(true)}>Open Confirm Modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm Transfer"
            description="Review the details below before proceeding."
            footer={
              <>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary">Confirm Transfer</Button>
              </>
            }
          >
            <div className="py-4 flex flex-col gap-4">
              <Alert
                type="warning"
                title="One-time action"
                message="This transfer cannot be reversed once processed."
              />
              <div className="bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.05]">
                {[
                  ["Recipient", "Stripe Inc."],
                  ["Amount", "$4,200.00"],
                  ["Fee", "$12.60 (0.3%)"],
                  ["Arrives", "1–2 business days"],
                  ["Reference", "INV-2026-0842"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between px-4 py-3">
                    <span className="text-primary/40 text-sm">{k}</span>
                    <span className="text-primary text-sm font-medium font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        </section>
      </div>
    </div>
  );
}
