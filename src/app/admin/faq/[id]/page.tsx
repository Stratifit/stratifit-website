'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiCheck,
  HiSparkles,
} from 'react-icons/hi2';
import {
  staticFaq as initialStaticFaq,
  nextStaticFaqId,
  type StaticFaqEntry,
} from '@/data/static-faq';

const STORAGE_KEY = 'static-faq-entries-v1';

export default function AdminSlugFaqDetail({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  const [seed, setSeed] = useState<StaticFaqEntry | null>(null);

  useEffect(() => {
    // setState in effect: this useEffect deliberately hydrates from localStorage
    // after mount. Multiple setStates seed the local state; block-disable covers them.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isNew) {
      setSeed({
        id: nextStaticFaqId(getStoredEntries() ?? initialStaticFaq),
        question: '',
        answer: '',
      });
      return;
    }
    const stored = getStoredEntries();
    const list = stored ?? initialStaticFaq;
    const found = list.find((e) => e.id === params.id);
    if (found) {
      setSeed(found);
    }
    else {
      setSeed({ id: params.id, question: params.id.replace(/-/g, ' '), answer: '' });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [params.id, isNew]);

  const [draft, setDraft] = useState<StaticFaqEntry | null>(null);
  useEffect(() => {
    // setState in effect: copies the hydrated seed into a local draft.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (seed) {
      setDraft(seed);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [seed]);

  if (!draft) return <p className="text-xs text-gray-500">Loading...</p>;

  const handleSave = () => {
    const list = getStoredEntries() ?? initialStaticFaq;
    const exists = list.some((e) => e.id === draft.id);
    const next = exists ? list.map((e) => (e.id === draft.id ? draft : e)) : [...list, draft];
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-8">
      <Link href="/admin/faq" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber transition-colors">
        <HiArrowLeft /> Back to FAQ
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">FAQ Detail</p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            {draft.question || (isNew ? 'New FAQ entry' : draft.id)}
          </h1>
          <p className="text-[10px] font-mono text-gray-600 mt-1">
            /{draft.id}
            {isNew && <span className="ml-2 text-amber">- new</span>}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm active:scale-95"
        >
          <HiCheck /> Save changes
        </button>
      </header>

      {isNew && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber flex items-center gap-2">
          <HiSparkles className="text-base" /> Creating a new static FAQ. Slug auto-generated - rename via the Id field below before saving if needed.
        </motion.div>
      )}

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5">
          <Row label="staticfaq.id">
            <input
              value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-l-2 focus:border-l-amber focus:outline-none transition-all"
            />
            <p className="text-[9px] font-mono text-gray-600 pl-1 mt-1">Slug used in the accordion key + /admin/faq/[id] route.</p>
          </Row>

          <Row label="staticfaq.question">
            <input
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              placeholder="What's the FAQ question?"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none transition-all"
            />
          </Row>

          <Row label="staticfaq.answer">
            <textarea
              rows={6}
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
              placeholder="1-3 sentence answer surfaced in the public FAQ accordion."
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-l-2 focus:border-l-amber focus:outline-none resize-y transition-all"
            />
          </Row>
        </div>

        <aside className="bg-card-dark rounded-2xl border border-white/5 p-6 space-y-5 h-fit">
          <Row label="staticfaq.role">
            <input value="static" readOnly className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono opacity-60 cursor-not-allowed" />
          </Row>

          <Row label="staticfaq.preview">
            <div className="bg-black border border-amber/15 rounded-2xl px-5 py-4 shadow-[inset_0_0_24px_rgba(245,158,11,0.05)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber mb-2 opacity-90">Accent preview</p>
              <p className="text-sm font-bold text-white leading-snug">{draft.question || '(empty question)'}</p>
              <p className="text-xs text-gray-300 leading-relaxed mt-2">{draft.answer || '(empty answer)'}</p>
            </div>
          </Row>
        </aside>
      </section>
    </div>
  );
}

function getStoredEntries(): StaticFaqEntry[] | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StaticFaqEntry[];
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch { return null; }
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">{label}</p>
      {children}
    </div>
  );
}
