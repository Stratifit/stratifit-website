'use client';

import { useState } from 'react';
import { useCms, saveCmsData, createCmsItem, deleteCmsItem } from '@/lib/use-cms';

interface InsightRow {
  id: string;
  sort_order: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string;
  read_minutes: number;
  is_published: boolean;
  published_at: string | null;
}

const EMPTY: Omit<InsightRow,'id'> = {
  sort_order: 99,
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  author: '',
  category: 'Strategy',
  tags: [],
  cover_image: '',
  read_minutes: 5,
  is_published: false,
  published_at: null,
};

export default function InsightsAdminPage() {
  const { data, loading, error, mutate } = useCms<InsightRow[]>('insights');
  const [editing, setEditing] = useState<InsightRow | null>(null);
  const [draft, setDraft] = useState<Omit<InsightRow,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const startCreate = () => { setEditing({ id: '__new__', ...EMPTY } as InsightRow); setDraft({ ...EMPTY }); };
  const startEdit = (row: InsightRow) => {
    setEditing(row);
    setDraft({
      sort_order: row.sort_order ?? 99,
      slug: row.slug ?? '',
      title: row.title ?? '',
      excerpt: row.excerpt ?? '',
      body: row.body ?? '',
      author: row.author ?? '',
      category: row.category ?? 'Strategy',
      tags: row.tags ?? [],
      cover_image: row.cover_image ?? '',
      read_minutes: row.read_minutes ?? 5,
      is_published: !!row.is_published,
      published_at: row.published_at ?? null,
    });
  };
  const cancel = () => { setEditing(null); setDraft(EMPTY); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id === '__new__') await createCmsItem('insights', draft);
      else await saveCmsData('insights', { id: editing.id, ...draft });
      await mutate();
      cancel();
    } catch (e) { alert('Save failed: ' + (e as Error).message); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this insight?')) return;
    setSaving(true);
    try { await deleteCmsItem('insights', id); await mutate(); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading insights...</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Insights</h1>
          <p className="text-sm text-gray-400">Blog posts shown on the Insights page.</p>
        </div>
        <button onClick={startCreate} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">+ New insight</button>
      </div>

      <div className="space-y-2">
        {(data ?? []).map(row => (
          <div key={row.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wide text-gray-400">{row.category} · {row.read_minutes} min</div>
                <div className="text-base font-semibold text-white">{row.title}</div>
                <div className="text-sm text-gray-400">{row.excerpt}</div>
                <div className="text-xs text-gray-500">/{row.slug}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(row)} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10">Edit</button>
                <button onClick={() => remove(row.id)} disabled={saving} className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && <div className="text-sm text-gray-400">No insights yet.</div>}
      </div>

      {editing && (
        <div className="rounded-lg border border-white/10 bg-black/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{editing.id === '__new__' ? 'New insight' : 'Edit insight'}</h2>
            <button onClick={cancel} className="text-xs text-gray-400 hover:text-white">Cancel</button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1"><div className="text-xs text-gray-400">Slug</div>
              <input value={draft.slug} onChange={e => setDraft(d => ({ ...d, slug: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Author</div>
              <input value={draft.author} onChange={e => setDraft(d => ({ ...d, author: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Category</div>
              <input value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Sort order</div>
              <input type="number" value={draft.sort_order} onChange={e => setDraft(d => ({ ...d, sort_order: Number(e.target.value) }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Read minutes</div>
              <input type="number" value={draft.read_minutes} onChange={e => setDraft(d => ({ ...d, read_minutes: Number(e.target.value) }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Cover image URL</div>
              <input value={draft.cover_image} onChange={e => setDraft(d => ({ ...d, cover_image: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
          </div>

          <label className="space-y-1 block"><div className="text-xs text-gray-400">Title</div>
            <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>

          <label className="space-y-1 block"><div className="text-xs text-gray-400">Excerpt</div>
            <textarea value={draft.excerpt} onChange={e => setDraft(d => ({ ...d, excerpt: e.target.value }))} rows={2} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>

          <label className="space-y-1 block"><div className="text-xs text-gray-400">Body</div>
            <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} rows={10} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>

          <label className="space-y-1 block"><div className="text-xs text-gray-400">Tags (comma-separated)</div>
            <input value={draft.tags.join(', ')} onChange={e => setDraft(d => ({ ...d, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={draft.is_published} onChange={e => setDraft(d => ({ ...d, is_published: e.target.checked }))} />
            Published
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={cancel} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10">Cancel</button>
            <button onClick={save} disabled={saving} className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
