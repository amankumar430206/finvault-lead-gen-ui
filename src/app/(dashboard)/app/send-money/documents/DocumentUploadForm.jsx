import { useSendMoneyForm } from "@/store/form.store";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// PURPOSE → DOCUMENT CONFIG
// ─────────────────────────────────────────────────────────────
const PURPOSE_DOCS = {
  "Overseas Education – University Fees": {
    label: "Overseas Education – University Fees",
    color: "emerald",
    documents: [
      {
        id: "fee-receipt",
        label: "Fee Receipt / Demand Letter",
        required: true,
        hint: "Official receipt issued by the university showing fee amount",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "offer-letter",
        label: "Offer / Admission Letter",
        required: true,
        hint: "Acceptance letter from the institution",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "enrollment",
        label: "Enrollment Confirmation",
        required: false,
        hint: "Proof of current enrollment (if applicable)",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "loan-letter",
        label: "Education Loan Letter",
        required: false,
        hint: "Bank sanction letter if fee is funded by a loan",
        accept: ".pdf",
      },
      {
        id: "passport",
        label: "Passport Copy",
        required: true,
        hint: "Clear copy of the bio-data page",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "visa",
        label: "Student Visa",
        required: false,
        hint: "Visa stamp / e-visa if already received",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
    ],
  },
  "Overseas Education – Living Expenses": {
    label: "Overseas Education – Living Expenses",
    color: "emerald",
    documents: [
      {
        id: "offer-letter",
        label: "Offer / Admission Letter",
        required: true,
        hint: "Required to justify overseas living",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "bank-statement",
        label: "Bank Statement (3 months)",
        required: true,
        hint: "Recent bank statement showing source of funds",
        accept: ".pdf",
      },
      {
        id: "passport",
        label: "Passport Copy",
        required: true,
        hint: "Clear copy of the bio-data page",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "rental",
        label: "Rental Agreement",
        required: false,
        hint: "Tenancy contract if remitting for rent payment",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
    ],
  },
  "Family Maintenance": {
    label: "Family Maintenance",
    color: "emerald",
    documents: [
      {
        id: "passport",
        label: "Passport Copy (Sender)",
        required: true,
        hint: "Bio-data page of the person sending money",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "relationship",
        label: "Relationship Proof",
        required: true,
        hint: "Birth certificate, marriage certificate, or family card",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "bank-statement",
        label: "Bank Statement (3 months)",
        required: true,
        hint: "To establish source of funds",
        accept: ".pdf",
      },
      {
        id: "recipient-id",
        label: "Recipient ID Proof",
        required: false,
        hint: "Passport or national ID of the recipient",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
    ],
  },
  "Medical Treatment Abroad": {
    label: "Medical Treatment Abroad",
    color: "emerald",
    documents: [
      {
        id: "medical-invoice",
        label: "Medical Invoice / Estimate",
        required: true,
        hint: "Bill or cost estimate from the overseas hospital",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "referral",
        label: "Doctor Referral Letter",
        required: true,
        hint: "Letter from treating physician recommending overseas treatment",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "passport",
        label: "Passport Copy (Patient)",
        required: true,
        hint: "Bio-data page of the patient",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "insurance",
        label: "Insurance Policy (if any)",
        required: false,
        hint: "Relevant insurance documents",
        accept: ".pdf",
      },
      {
        id: "bank-statement",
        label: "Bank Statement (3 months)",
        required: false,
        hint: "To confirm source of funds",
        accept: ".pdf",
      },
    ],
  },
  "Business Services / Import of Goods": {
    label: "Business Services / Import of Goods",
    color: "emerald",
    documents: [
      {
        id: "invoice",
        label: "Commercial Invoice",
        required: true,
        hint: "Proforma or commercial invoice from overseas supplier",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "contract",
        label: "Service / Purchase Contract",
        required: true,
        hint: "Signed agreement with the overseas entity",
        accept: ".pdf",
      },
      {
        id: "gst-cert",
        label: "GST Registration Certificate",
        required: false,
        hint: "If remittance is for import of goods / services",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "bank-statement",
        label: "Bank Statement (3 months)",
        required: false,
        hint: "Source of funds",
        accept: ".pdf",
      },
      {
        id: "pan-card",
        label: "PAN Card",
        required: true,
        hint: "Mandatory for all LRS remittances above ₹50,000",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
    ],
  },
  "Gift / Donation": {
    label: "Gift / Donation",
    color: "emerald",
    documents: [
      {
        id: "passport",
        label: "Passport Copy (Sender)",
        required: true,
        hint: "Bio-data page",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "relationship",
        label: "Relationship Proof",
        required: false,
        hint: "If gifting to a family member",
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      {
        id: "gift-declaration",
        label: "Gift Declaration Letter",
        required: true,
        hint: "Signed self-declaration of intent to gift",
        accept: ".pdf",
      },
      {
        id: "bank-statement",
        label: "Bank Statement (3 months)",
        required: true,
        hint: "Source of funds",
        accept: ".pdf",
      },
    ],
  },
};

const PURPOSES = Object.entries(PURPOSE_DOCS).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  icon: cfg.icon,
  color: cfg.color,
}));

console.log("PURPOSES", PURPOSES);
// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { icon: "PDF", bg: "bg-red-500/10 text-red-400" };
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return { icon: "IMG", bg: "bg-blue-500/10 text-blue-400" };
  return { icon: "DOC", bg: "bg-inputbg text-primary/45" };
};

const colorMap = {
  emerald: {
    pill: "bg-accent/10 text-accent  border-[var(--border-clr)]",
    glow: "via-emerald-500/40",
    ring: " border-[var(--border-clr)] bg-accent/[0.07]",
    dot: "bg-accent",
  },
  blue: {
    pill: "bg-blue-500/10    text-blue-400    border-blue-500/20",
    glow: "via-blue-500/40",
    ring: "border-blue-500/50    bg-blue-500/[0.07]",
    dot: "bg-blue-400",
  },
  violet: {
    pill: "bg-violet-500/10  text-violet-400  border-violet-500/20",
    glow: "via-violet-500/40",
    ring: "border-violet-500/50  bg-violet-500/[0.07]",
    dot: "bg-violet-400",
  },
  rose: {
    pill: "bg-rose-500/10    text-rose-400    border-rose-500/20",
    glow: "via-rose-500/40",
    ring: "border-rose-500/50    bg-rose-500/[0.07]",
    dot: "bg-rose-400",
  },
  amber: {
    pill: "bg-amber-500/10   text-amber-400   border-amber-500/20",
    glow: "via-amber-500/40",
    ring: "border-amber-500/50   bg-amber-500/[0.07]",
    dot: "bg-amber-400",
  },
  cyan: {
    pill: "bg-cyan-500/10    text-cyan-400    border-cyan-500/20",
    glow: "via-cyan-500/40",
    ring: "border-cyan-500/50    bg-cyan-500/[0.07]",
    dot: "bg-cyan-400",
  },
};

// ─────────────────────────────────────────────────────────────
// UPLOAD ZONE
// ─────────────────────────────────────────────────────────────
const UploadZone = ({ docId, file, onFile, onRemove, accept, required, color }) => {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const c = colorMap[color] ?? colorMap.emerald;

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(docId, f);
    },
    [docId, onFile],
  );

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFile(docId, f);
    e.target.value = "";
  };

  const fileIcon = file ? getFileIcon(file.name) : null;

  if (file) {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.ring} transition-all`}>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold mono shrink-0 ${fileIcon.bg}`}
        >
          {fileIcon.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary/80 text-sm font-medium truncate">{file.name}</p>
          <p className="text-primary/50 text-xs mt-0.5">{fmtSize(file.size)}</p>
        </div>
        {/* Progress bar (simulated) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-16 h-1 bg-inputbg rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.dot}`} style={{ width: "100%" }} />
          </div>
          <span className="text-[10px] text-primary/50">Done</span>
          <button
            onClick={() => onRemove(docId)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-primary/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M2 2l8 8M10 2L2 10" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        "flex flex-col items-center justify-center gap-2.5 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 group",
        drag
          ? ` border-[var(--border-clr)] bg-accent/[0.06] scale-[1.01]`
          : " border-[var(--border-clr)] hover: border-[var(--border-clr)] hover:bg-inputbg",
      ].join(" ")}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
        ${drag ? "bg-accent/15 text-accent" : "bg-inputbg text-primary/70 group-hover:text-primary/75"}`}
      >
        <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-primary/40 text-xs font-medium group-hover:text-primary/60 transition-colors">
          {drag ? "Drop to upload" : "Click or drag to upload"}
        </p>
        <p className="text-primary/20 text-[10px] mt-0.5">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, " · ")}
        </p>
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DOCUMENT ROW
// ─────────────────────────────────────────────────────────────
const DocumentRow = ({ doc, file, onFile, onRemove, color, index }) => {
  const c = colorMap[color] ?? colorMap.emerald;
  const uploaded = !!file;

  return (
    <div
      className="rounded-2xl border  border-[var(--border-clr)] bg-inputbg overflow-hidden transition-all duration-200"
      style={{ animation: `fadeUp 0.3s ease ${index * 0.06}s both` }}
    >
      {/* Row header */}
      <div className="flex items-start gap-3 px-5 py-4">
        {/* Status indicator */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300
          ${uploaded ? `${c.dot} border-transparent` : " border-[var(--border-clr)]"}`}
        >
          {uploaded && (
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
              <path
                d="M2 5l2.5 2.5 3.5-4.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-medium transition-colors ${uploaded ? "text-primary" : "text-primary/70"}`}>
              {doc.label}
            </p>
            {doc.required ? (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-inputbg text-primary/50">
                Optional
              </span>
            )}
          </div>
          <p className="text-primary/28 text-xs mt-0.5 leading-relaxed">{doc.hint}</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="px-5 pb-5">
        <UploadZone
          docId={doc.id}
          file={file}
          onFile={onFile}
          onRemove={onRemove}
          accept={doc.accept}
          required={doc.required}
          color={color}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PURPOSE SELECTOR
// ─────────────────────────────────────────────────────────────
const PurposeSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    {PURPOSES.map((p) => {
      const active = value === p.id;
      const c = colorMap[p.color];
      return (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={[
            "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200",
            active
              ? `${c.ring} border`
              : " border-[var(--border-clr)] bg-inputbg hover: border-[var(--border-clr)] hover:bg-inputbg",
          ].join(" ")}
        >
          <span className="text-xl leading-none shrink-0">{p.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${active ? "text-primary" : "text-primary/60"}`}>{p.label}</p>
          </div>
          {active && (
            <div className={`w-4 h-4 rounded-full ${c.dot} flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                <path
                  d="M2 5l2.5 2.5 3.5-4.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// PROGRESS HEADER
// ─────────────────────────────────────────────────────────────
const ProgressHeader = ({ docs, uploads, color }) => {
  const required = docs.filter((d) => d.required);
  const doneReq = required.filter((d) => uploads[d.id]);
  const doneAll = docs.filter((d) => uploads[d.id]);
  const pct = required.length ? Math.round((doneReq.length / required.length) * 100) : 0;
  const c = colorMap[color] ?? colorMap.emerald;
  const allDone = doneReq.length === required.length;

  return (
    <div
      className={`rounded-xl border p-4 mb-2 transition-all duration-500 ${allDone ? c.ring + " border" : " border-[var(--border-clr)] bg-inputbg"}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-primary/55 text-sm font-medium">
            {doneReq.length}/{required.length} required uploaded
          </span>
          {allDone && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.pill} border`}>
              ✓ All required done
            </span>
          )}
        </div>
        <span className="text-primary/50 text-xs font-mono">
          {doneAll.length} / {docs.length} total
        </span>
      </div>
      <div className="h-1.5 bg-inputbg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${c.dot} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function DocumentUploadPage() {
  const formData = useSendMoneyForm((s) => s.formData);

  console.log("formdata", formData);
  const [purpose, setPurpose] = useState(formData?.purposeCode || "");
  const [uploads, setUploads] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const cfg = purpose ? PURPOSE_DOCS[purpose] : null;
  const docs = cfg?.docs ?? cfg?.documents ?? [];
  const color = cfg?.color ?? "emerald";
  const c = colorMap[color] ?? colorMap.emerald;

  const handleFile = (id, file) => setUploads((p) => ({ ...p, [id]: file }));
  const handleRemove = (id) =>
    setUploads((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });

  const validate = () => {
    const errs = {};
    if (!purpose) {
      errs.purpose = "Please select a purpose";
    } else {
      docs
        .filter((d) => d.required)
        .forEach((d) => {
          if (!uploads[d.id]) errs[d.id] = `${d.label} is required`;
        });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const uploadedCount = Object.keys(uploads).length;
  const requiredDocs = docs.filter((d) => d.required);
  const requiredDone = requiredDocs.filter((d) => uploads[d.id]);
  const canSubmit = purpose && requiredDone.length === requiredDocs.length;

  // ── Success ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-md">
          <div className={`h-px w-full bg-gradient-to-r from-bg-card ${c.glow} from-bg-card`} />
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${c.ring} border flex items-center justify-center text-3xl`}>
              {cfg?.icon}
            </div>
            <div>
              <h2 className="text-primary text-xl font-semibold">Documents Submitted</h2>
              <p className="text-primary/40 text-sm mt-1.5">
                Your documents are under review. We'll notify you within 24–48 hours.
              </p>
            </div>
            <div className="w-full bg-inputbg rounded-xl border  border-[var(--border-clr)] divide-y divide-white/[0.04] text-left">
              <div className="flex justify-between px-4 py-3">
                <span className="text-primary/50 text-sm">Purpose</span>
                <span className="text-primary/70 text-sm font-medium">{cfg?.label}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-primary/50 text-sm">Documents uploaded</span>
                <span className="text-primary/70 text-sm font-mono font-medium">{uploadedCount} files</span>
              </div>
            </div>
            <Link
              href={"/app/send-money/review"}
              onClick={() => {
                setSubmitted(false);
                setPurpose("");
                setUploads({});
                setErrors({});
              }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-sm transition-all shadow-md shadow-accent/30"
            >
              Review Transfer & Confirm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-4 md:p-8">
      <div className="max-w-[660px] mx-auto">
        {/* ── Page header ── */}
        <div className="fade-up mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border  border-[var(--border-clr)] flex items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h1 className="text-primary font-semibold text-lg tracking-tight">Upload Documents</h1>
          </div>
          <p className="text-primary/50 text-sm ml-11">Required documents vary by transfer purpose</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── SECTION 1: Purpose ── */}
          <div
            className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl mb-4 fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="h-px w-full bg-gradient-to-r from-bg-card via-emerald-500/40 from-bg-card" />
            <div className="px-6 pt-6 pb-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="text-primary font-semibold text-[15px]">Select transfer purpose</h2>
              </div>
              <PurposeSelector
                value={purpose}
                onChange={(p) => {
                  setPurpose(p);
                  setUploads({});
                  setErrors({});
                }}
              />
              {errors.purpose && (
                <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5">
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="6" cy="6" r="5" />
                    <path strokeLinecap="round" d="M6 4v3M6 8.5h.01" />
                  </svg>
                  {errors.purpose}
                </p>
              )}
            </div>
          </div>

          {/* ── SECTION 2: Documents (dynamic) ── */}
          {purpose && cfg && (
            <div className="rounded-2xl bg-card border  border-[var(--border-clr)] overflow-hidden shadow-xl mb-4 slide-down">
              <div className={`h-px w-full bg-gradient-to-r from-bg-card ${c.glow} from-bg-card`} />
              <div className="px-6 pt-6 pb-5">
                {/* Section header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h2 className="text-primary font-semibold text-[15px]">Upload documents</h2>
                      <p className="text-primary/50 text-xs mt-0.5">
                        for{" "}
                        <span
                          className={`font-medium ${colorMap[color]?.pill.split(" ").find((c) => c.startsWith("text-"))}`}
                        >
                          {cfg.label}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.pill} shrink-0`}>
                    {cfg.icon} {docs.length} docs
                  </span>
                </div>

                {/* Progress */}
                <ProgressHeader docs={docs} uploads={uploads} color={color} />

                {/* Document rows */}
                <div className="flex flex-col gap-3 mt-4">
                  {docs.map((doc, i) => (
                    <div key={doc.id}>
                      <DocumentRow
                        doc={doc}
                        file={uploads[doc.id]}
                        onFile={handleFile}
                        onRemove={handleRemove}
                        color={color}
                        index={i}
                      />
                      {errors[doc.id] && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1.5">
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="6" cy="6" r="5" />
                            <path strokeLinecap="round" d="M6 4v3M6 8.5h.01" />
                          </svg>
                          {errors[doc.id]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info note */}
                <div className="flex gap-3 mt-5 rounded-xl bg-inputbg border  border-[var(--border-clr)] p-3.5">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 text-primary/70 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="8" cy="8" r="6.5" />
                    <path strokeLinecap="round" d="M8 7v4M8 5.5h.01" />
                  </svg>
                  <div className="text-primary/50 text-xs leading-relaxed space-y-1">
                    <p>
                      Max file size: <span className="text-primary/75 font-medium">10 MB</span> per document
                    </p>
                    <p>
                      Accepted formats: <span className="text-primary/75 font-medium">PDF, JPG, PNG</span>
                    </p>
                    <p>
                      All documents are <span className="text-primary/75 font-medium">encrypted</span> and stored
                      securely per RBI guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="fade-up" style={{ animationDelay: "0.15s" }}>
            <button
              type="submit"
              disabled={loading || !purpose}
              className={[
                "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl",
                "text-primary text-sm font-semibold transition-all duration-200",
                canSubmit
                  ? "text-white bg-accent hover:bg-accent/80 shadow-md shadow-accent/20 hover:shadow-accent/20"
                  : "bg-inputbg border  border-[var(--border-clr)] text-primary/50 cursor-not-allowed",
                loading ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting documents…
                </>
              ) : !purpose ? (
                "Select a purpose to continue"
              ) : !canSubmit ? (
                <>
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10.5v-2.625a4.5 4.5 0 00-4.5-4.5 4.5 4.5 0 00-4.5 4.5V10.5M3 10.5h10a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3a1 1 0 011-1z"
                    />
                  </svg>
                  Upload {requiredDocs.length - requiredDone.length} more required document
                  {requiredDocs.length - requiredDone.length !== 1 ? "s" : ""}
                </>
              ) : (
                <>
                  Submit {uploadedCount} Document{uploadedCount !== 1 ? "s" : ""}
                  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h8M8 4l3 3-3 3" />
                  </svg>
                </>
              )}
            </button>

            {purpose && !canSubmit && (
              <p className="text-center text-primary/20 text-xs mt-3">
                {requiredDone.length}/{requiredDocs.length} required documents uploaded
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
