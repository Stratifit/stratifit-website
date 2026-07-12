'use client';

import { useState } from 'react';
import type { Language } from '@/lib/cms-types';
import { useCms, saveCmsData, createCmsItem, deleteCmsItem } from '@/lib/use-cms';

interface ServiceRow {
  id: string;
  sort_order: number;
  icon: string;
  title: Record<Language,string> | string;
  description: Record<Language,string> | string;
  features: Array<Record<Language,string>>;
  accent: string;
}

const LANGUAGES: Language[] = ['en','de','fr','es'];

function t(v: unknown, lang: Language): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return (v as Record<string,string>)[lang] ?? (v as Record<string,string>).en ?? '';
  return '';
}

const EMPTY: Omit<ServiceRow,'id'> = {
  sort_order: 99,
  icon: 'sparkles',
  title: { en:'', de:'', fr:'', es:'' },
  description: { en:'', de:'', fr:'', es:'' },
  features: [{ en:'', de:'', fr:'', es:'' }],
  accent: '#4ECDC4',
};

export default function ServicesAdminPage() {
  const { data, loading, error, mutate } = useCms<ServiceRow[]>('services');
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [draft, setDraft] = useState<Omit<ServiceRow,'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const startCreate = () => { setEditing({ id: '__new__', ...EMPTY } as ServiceRow); setDraft({ ...EMPTY }); };
  const startEdit = (row: ServiceRow) => {
    setEditing(row);
    setDraft({
      sort_order: row.sort_order ?? 99,
      icon: row.icon ?? '',
      title: typeof row.title === 'object' && row.title !== null && !Array.isArray(row.title) ? row.title as Record<Language,string> : { en: String(row.title ?? ''), de:' ', fr:' ', es:' ' },
      description: typeof row.description === 'object' && row.description !== null && !Array.isArray(row.description) ? row.description as Record<Language,string> : { en: String(row.description ?? ''), de:' ', fr:' ', es:' ' },
      features: row.features ?? [],
      accent: row.accent ?? '#4ECDC4',
    });
  };
  const cancel = () => { setEditing(null); setDraft(EMPTY); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id === '__new__') await createCmsItem('services', draft);
      else await saveCmsData('services', { id: editing.id, ...draft });
      await mutate();
      cancel();
    } catch (e) { alert('Save failed: ' + (e as Error).message); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    setSaving(true);
    try { await deleteCmsItem('services', id); await mutate(); }
    finally { setSaving(false); }
  };

  const updateLangField = (field: 'title'|'description', lang: Language, val: string) => setDraft(prev => {
    const cur = prev[field] as Record<Language,string>;
    return { ...prev, [field]: { ...cur, [lang]: val } };
  });

  const setFeature = (idx: number, lang: Language, val: string) => setDraft(prev => {
    const arr = prev.features.map(f => ({ ...f }));
    arr[idx] = { ...(arr[idx] ?? { en:'',de:'',fr:'',es:'' }), [lang]: val };
    return { ...prev, features: arr };
  });
  const addFeature = () => setDraft(prev => ({ ...prev, features: [...prev.features, { en:'',de:'',fr:'',es:'' }] }));
  const removeFeature = (idx: number) => setDraft(prev => ({ ...prev, features: prev.features.filter((_,i) => i !== idx) }));

  if (loading) return <div className="p-6 text-gray-400">Loading services...</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Services</h1>
          <p className="text-sm text-gray-400">Core services shown on the homepage.</p>
        </div>
        <button onClick={startCreate} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">+ New service</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map(row => (
          <div key={row.id} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{row.icon}</span>
              <div className="text-base font-semibold text-white">{t(row.title,'en')}</div>
            </div>
            <p className="text-sm text-gray-400">{t(row.description,'en')}</p>
            <ul className="text-sm text-gray-300 list-disc pl-5 space-y-0.5">
              {(row.features ?? []).map((f,i) => <li key={i}>{t(f,'en')}</li>)}
            </ul>
            <div className="flex gap-2 pt-2">
              <button onClick={() => startEdit(row)} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10">Edit</button>
              <button onClick={() => remove(row.id)} disabled={saving} className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && <div className="text-sm text-gray-400 col-span-2">No services yet.</div>}
      </div>

      {editing && (
        <div className="rounded-lg border border-white/10 bg-black/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{editing.id === '__new__' ? 'New service' : 'Edit service'}</h2>
            <button onClick={cancel} className="text-xs text-gray-400 hover:text-white">Cancel</button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1"><div className="text-xs text-gray-400">Icon (emoji)</div>
              <input value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Sort order</div>
              <input type="number" value={draft.sort_order} onChange={e => setDraft(d => ({ ...d, sort_order: Number(e.target.value) }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
            <label className="space-y-1"><div className="text-xs text-gray-400">Accent</div>
              <input value={draft.accent} onChange={e => setDraft(d => ({ ...d, accent: e.target.value }))} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white" /></label>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">Title</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LANGUAGES.map(lang => <input key={lang} placeholder={lang.toUpperCase()} value={(draft.title as Record<string,string>)[lang] ?? ''} onChange={e => updateLangField('title', lang, e.target.value)} className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white" />)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Description</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {LANGUAGES.map(lang => <textarea key={lang} placeholder={lang.toUpperCase()} rows={3} value={(draft.description as Record<string,string>)[lang] ?? ''} onChange={e => updateLangField('description', lang, e.target.value)} className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-sm text-white" />)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-2">Features</div>
            {draft.features.map((feature, idx) => (
              <div key={idx} className="rounded-md border border-white/10 bg-white/5 p-2 mb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">Feature {idx+1}</div>
                  <button onClick={() => removeFeature(idx)} className="text-xs text-red-300">Remove</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {LANGUAGES.map(lang => <input key={lang} placeholder={lang.toUpperCase()} value={feature[lang] ?? ''} onChange={e => setFeature(idx, lang, e.target.value)} className="rounded-md bg-black/30 border border-white/10 px-2 py-1 text-xs text-white" />)}
                </div>
              </div>
            ))}
            <button onClick={addFeature} className="text-xs text-primary">+ Add feature</button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={cancel} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10">Cancel</button>
            <button onClick={save} disabled={saving} className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
