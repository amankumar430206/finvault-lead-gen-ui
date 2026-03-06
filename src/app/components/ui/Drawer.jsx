<>
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setDetailRow(null)} />
  <div
    ref={detailRef}
    className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l  border-[var(--border-clr)] z-50 flex flex-col shadow-md slide-in"
  >
    <div className="h-px w-full bg-gradient-to-r from-bg-card via-emerald-500/40 from-bg-card" />

    {/* Drawer header */}
    <div className="flex items-center justify-between px-6 py-5 border-b  border-[var(--border-clr)]">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg ${(categoryIcon[detailRow.category] || { bg: "bg-inputbg" }).bg} flex items-center justify-center text-sm`}
        >
          {(categoryIcon[detailRow.category] || { icon: "•" }).icon}
        </div>
        <div>
          <p className="text-primary font-semibold text-sm">{detailRow.name}</p>
          <p className="text-primary/50 text-xs mono">{detailRow.id}</p>
        </div>
      </div>
      <button
        onClick={() => setDetailRow(null)}
        className="text-primary/70 hover:text-primary/60 hover:bg-inputbg rounded-lg p-1.5 transition-all"
      >
        <svg viewBox="0 0 14 14" className="w-4 h-4" fill="currentColor">
          <path d="M3.293 3.293a1 1 0 011.414 0L7 5.586l2.293-2.293a1 1 0 111.414 1.414L8.414 7l2.293 2.293a1 1 0 01-1.414 1.414L7 8.414l-2.293 2.293a1 1 0 01-1.414-1.414L5.586 7 3.293 4.707a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>

    {/* Amount hero */}
    <div className="px-6 py-6 border-b  border-[var(--border-clr)]">
      <p className="text-primary/50 text-xs uppercase tracking-wider mb-1">Amount</p>
      <p className={`text-3xl font-bold mono ${detailRow.type === "credit" ? "text-accent" : "text-red-400"}`}>
        {detailRow.type === "credit" ? "+" : "–"}
        {fmtAmount(detailRow.amount, detailRow.currency)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[detailRow.status].bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle[detailRow.status].dot}`} />
          {detailRow.status.charAt(0).toUpperCase() + detailRow.status.slice(1)}
        </span>
        <span className="text-primary/70 text-xs">
          {detailRow.flag} {detailRow.currency}
        </span>
      </div>
    </div>

    {/* Details list */}
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="rounded-xl border  border-[var(--border-clr)] bg-inputbg divide-y divide-white/[0.04] overflow-hidden">
        {[
          ["Transaction ID", detailRow.id],
          ["Date", detailRow.date],
          ["Category", detailRow.category],
          ["Method", detailRow.method],
          ["Type", detailRow.type.charAt(0).toUpperCase() + detailRow.type.slice(1)],
          ["Currency", `${detailRow.flag} ${detailRow.currency}`],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3">
            <span className="text-primary/50 text-sm">{k}</span>
            <span className="text-primary/75 text-sm font-medium mono">{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2">
        <button className="w-full py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/60 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all">
          Download Receipt
        </button>
        <button className="w-full py-2.5 rounded-xl bg-inputbg border  border-[var(--border-clr)] text-primary/60 hover:text-primary hover:bg-inputbg text-sm font-medium transition-all">
          Flag for Review
        </button>
        {detailRow.status === "failed" && (
          <button className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all shadow-md shadow-accent/30">
            Retry Transfer
          </button>
        )}
      </div>
    </div>
  </div>
</>;
