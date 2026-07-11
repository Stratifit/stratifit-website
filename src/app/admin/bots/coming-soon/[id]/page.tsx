"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiCheck,
  HiSparkles,
  HiChatBubbleLeftRight,
  HiChevronRight,
} from "react-icons/hi2";
import {
  comingSoonResponses,
  comingSoonChips,
  comingSoonKeywords,
  findComingSoonAnswer,
  type ComingSoonIntent,
} from "@/data/coming-soon-bot";

const intents: ComingSoonIntent[] = ["subscribe", "team", "info"];

const intentCopy: Record<ComingSoonIntent, { label: string; action: string }> = {
  subscribe: { label: "Subscribe for Launch",  action: "Scrolls the user to the email input." },
  team:      { label: "Talk to the Team",     action: "Opens the contact modal." },
  info:      { label: "Explore Services",     action: "Scrolls to the services carousel on the gate." },
};

export default function AdminComingSoonDetail({ params }: { params: { id: string } }) {
  const found = comingSoonResponses[params.id];
  const chip  = comingSoonChips.find((c) => c.id === params.id);
  const fallback = {
    id: params.id,
    label: chip?.label ?? params.id.replace(/-/g, " "),
    text: "",
    intent: undefined as undefined | ComingSoonIntent,
  };

  const entry = found
    ? {
        id: params.id,
        label: chip?.label ?? params.id.replace(/-/g, " "),
        text: found.text,
        intent: found.intent,
      }
    : fallback;

  const isFallback = entry.id === "fallback";
  const isChip = Boolean(chip);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/bots/coming-soon"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors"
      >
        <HiArrowLeft /> Back to Pre-launch Bot
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            Chip Detail
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            {entry.label}
          </h1>
          <p className="text-[10px] font-mono text-gray-600 mt-1">/{entry.id}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm active:scale-95">
          <HiCheck /> Save changes
        </button>
      </header>

      {!found && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber flex items-center gap-2"
        >
          <HiSparkles className="text-base" />
          This id isn&apos;t in the coming-soon knowledge base yet — the form below shows a placeholder. Add it to{" "}
          <span className="font-mono">src/data/coming-soon-bot.ts</span> and refresh.
        </motion.div>
      )}

      {/* Form grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5">
          <Row label="{{cs.id}}">
            <input
              defaultValue={entry.id}
              readOnly={Boolean(found)}
              className={`w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all ${found ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {found && (
              <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
                Id is the lookup key for the chip rail and free-form matcher — change with care.
              </p>
            )}
          </Row>

          <Row label="{{cs.label}}">
            <input
              defaultValue={entry.label}
              placeholder="Visible chip label, e.g. Pricing preview"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all"
            />
            {!isChip && (
              <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
                This entry isn&apos;t in the chip rail yet — it will only appear when matched via free-form input.
              </p>
            )}
          </Row>

          <Row label="{{cs.text}}">
            <textarea
              rows={12}
              defaultValue={entry.text}
              placeholder="Multi-line answer rendered in the bot. Use emoji prefixes, **bold** markers, and real newlines for line breaks."
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none resize-y transition-all"
            />
            <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
              Tip: keep the answer under 4 lines for chat readability. The CTA intent (below) appears beneath the answer.
            </p>
          </Row>
        </div>

        <aside className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5 h-fit">
          <Row label="{{cs.role}}">
            <input
              defaultValue="bot"
              readOnly
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono opacity-60 cursor-not-allowed"
            />
          </Row>

          <Row label="{{cs.intent_label}}">
            <div className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white">
              {entry.intent ? (
                <span className="text-amber font-bold">{intentCopy[entry.intent].label}</span>
              ) : (
                <span className="text-gray-500 italic">No CTA chip will appear (empty intent → no auto-CTA).</span>
              )}
              {entry.intent && (
                <p className="text-[10px] text-gray-500 mt-1">{intentCopy[entry.intent].action}</p>
              )}
            </div>
          </Row>

          <Row label="{{cs.intent}}">
            <select
              defaultValue={entry.intent ?? ""}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none cursor-pointer transition-all"
            >
              <option value="">— no CTA —</option>
              {intents.map((i) => (
                <option key={i} value={i} className="bg-black text-white">
                  {i} · {intentCopy[i].label}
                </option>
              ))}
            </select>
            <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">
              Drives the button the bot shows beneath the answer.
            </p>
          </Row>

          <div className="h-px bg-white/5" />

          <Row label="{{match.triggers}}">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Free-form phrases — the bot matches user input against these to surface this answer (in addition to the chip rail).
            </p>
            <ul className="mt-2 space-y-1">
              {(comingSoonKeywords[entry.id] ?? []).map((k) => (
                <li key={k} className="text-[10px] font-mono text-gray-400">
                  · {k}
                </li>
              ))}
              {isFallback && (
                <li className="text-[10px] font-mono text-gray-400">
                  (fallback — fires when no other entry matches)
                </li>
              )}
              {!comingSoonKeywords[entry.id] && !isFallback && (
                <li className="text-[10px] font-mono text-amber">
                  add match keywords in src/data/coming-soon-bot.ts → comingSoonKeywords
                </li>
              )}
            </ul>
          </Row>
        </aside>
      </section>

      {/* Live preview */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber">
          <HiChatBubbleLeftRight className="text-base text-amber" /> Live preview — how the chip or fallback renders in the chat
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-black border border-amber/15 rounded-2xl px-5 py-4 shadow-[inset_0_0_24px_rgba(245,158,11,0.05)]"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber mb-2 opacity-90">
              bot · answer
            </p>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200 font-sans">
              {entry.text || "(empty answer — bot will fall back to Talk-to-the-Team)"}
            </pre>
            {entry.intent && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber text-black font-bold text-xs rounded-xl shadow-[0_0_18px_rgba(245,158,11,0.2)]">
                  <HiChevronRight className="text-sm" />
                  {intentCopy[entry.intent].label}
                </span>
              </div>
            )}
          </motion.div>
          <div className="bg-black border border-white/5 rounded-2xl px-4 py-3 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Chip rail entry</p>
            {isChip ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber text-black text-[11px] font-bold">
                {entry.label}
              </span>
            ) : (
              <p className="text-[11px] text-gray-500 italic">Not in chip rail — only surfaces via free-form matcher.</p>
            )}
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
              When the user taps this chip in the chat rail, the bot replies with the answer above and (if intent is set) shows the matching CTA.
            </p>
          </div>
        </div>
      </section>

      {/* Free-form matcher preview */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber">
          Free-form matcher
        </div>
        <div className="bg-black border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono text-gray-400">
          findComingSoonAnswer(&quot;user typed query&quot;) → {"{"} id: <span className="text-amber">&quot;{findIdFor(entry.id)}&quot;</span> {"}"}
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {children}
    </div>
  );
}

/* internal helper — does not render but illustrates which id the matcher resolves to */
function findIdFor(_id: string): string {
  return _id;
}
