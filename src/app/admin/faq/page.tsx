'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiTrash,
} from 'react-icons/hi2';
import { staticFaq as initialStaticFaq, type StaticFaqEntry } from '@/data/static-faq';

const STORAGE_KEY = 'static-faq-entries-v1';

export default function AdminFaqPage() {
  const [entries, setEntries] = useState<StaticFaqEntry[]>(initialStaticFaq);
  const [search, setSearch] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StaticFaqEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) setEntries(parsed);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const persist = (next: StaticFaqEntry[]) => {
    setEntries(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this FAQ entry? Edits stay in this browser until you re-run /admin/faq.')) return;
    persist(entries.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) =>
    [e.question, e.answer].some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">Site Configuration</p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">FAQ</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-lg">
            Manage the normal FAQ accordion on the public <Link href="/faq" className="text-amber">/faq</Link> page. Edits persist in this browser via localStorage.
          </p>
        </div>
        <Link
          href="/admin/faq/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
        >
          <HiPlus className="text-base" /> New FAQ entry
        </Link>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile label="Total entries" value={entries.length} />
        <StatTile label="Avg answer length" value={Math.round(entries.reduce((s, e) => s + e.answer.length, 0) / Math.max(entries.length, 1)) + ' chars'} />
        <StatTile label="Storage" value={hydrated ? 'live - localStorage' : 'syncing...'} />
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 p-4">
        <label className="relative block">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by question or answer"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </label>
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-mono text-gray-500">{'{{staticfaq.question}} - {{staticfaq.answer}}'}</p>
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{entries.length}</span> entries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Question</th>
                <th className="px-6 py-3 font-bold">Answer (preview)</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Slug</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((entry, i) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-white max-w-[420px]">{entry.question}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 max-w-[480px] line-clamp-2">{entry.answer}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-[10px] font-mono text-gray-600">/{entry.id}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/admin/faq/${entry.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber hover:bg-amber/10 transition-all"
                      >
                        <HiPencilSquare className="text-sm" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all"
                        aria-label={'Delete FAQ entry ' + entry.id}
                      >
                        <HiTrash className="text-sm" /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-500">
                    No FAQ entries match the search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 p-5 flex items-start gap-3">
        <HiPlus className="text-amber text-base mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber mb-1">Source of truth</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            The {initialStaticFaq.length} seed entries are sourced from{' '}
            <span className="font-mono text-gray-300">src/data/static-faq.ts</span>{' '}
            and rendered on the public /faq accordion. Edits you make here persist across admin navigation but will not change the data module file until you wire a backend sync.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card-dark rounded-2xl border border-white/5 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className="mt-2 font-heading font-black text-xl sm:text-2xl text-white tracking-tight">{value}</p>
    </div>
  );
}
