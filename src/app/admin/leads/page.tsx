"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiChevronDown,
  HiArrowRight,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Mock leads (will be replaced by Supabase query later)            */
/* ------------------------------------------------------------------ */
const mockLeads = [
  {
    id: "SAMPLE-1",
    name: "Sample Lead",
    email: "lead1@example.com",
    service: "Brand Design",
    source: "Website — Contact Form",
    status: "new",
    budget: "$1,000 – $3,000",
    created: "2026-07-09 · 14:32",
  },
  {
    id: "SAMPLE-2",
    name: "Sample Lead",
    email: "lead2@example.com",
    service: "AI Automation",
    source: "Chatbot Conversation",
    status: "qualified",
    budget: "$5,000 – $7,000",
    created: "2026-07-09 · 09:14",
  },
  {
    id: "SAMPLE-3",
    name: "Sample Lead",
    email: "lead3@example.com",
    service: "Website Development",
    source: "Coming-soon Notify Form",
    status: "in-review",
    budget: "$3,000 – $5,000",
    created: "2026-07-08 · 21:05",
  },
  {
    id: "SAMPLE-4",
    name: "Sample Lead",
    email: "lead4@example.com",
    service: "Growth Marketing",
    source: "Website — Contact Form",
    status: "won",
    budget: "$7,000 – $10,000",
    created: "2026-07-08 · 11:48",
  },
  {
    id: "SAMPLE-5",
    name: "Sample Lead",
    email: "lead5@example.com",
    service: "Buy a Business",
    source: "Buy-page Inquiry",
    status: "lost",
    budget: "$15K – $20K",
    created: "2026-07-07 · 17:22",
  },
];

const services = ["All services", "Brand Design", "AI Automation", "Website Development", "Growth Marketing", "Buy a Business", "Funnel Strategy"];
const statuses = ["All statuses", "new", "qualified", "in-review", "won", "lost"];
const sources = ["All sources", "Website — Contact Form", "Chatbot Conversation", "Coming-soon Notify Form", "Buy-page Inquiry"];

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState(services[0]);
  const [statusFilter, setStatusFilter] = useState(statuses[0]);
  const [sourceFilter, setSourceFilter] = useState(sources[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          CRM
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Leads
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          View and filter all incoming leads.
        </p>
      </header>

      {/* Filters row */}
      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors"
          />
        </label>
        <FilterSelect
          label="Service" /* {{filter_service_type}} */
          value={serviceFilter}
          options={services}
          onChange={setServiceFilter}
        />
        <FilterSelect
          label="Status" /* {{filter_status}} */
          value={statusFilter}
          options={statuses}
          onChange={setStatusFilter}
        />
        <FilterSelect
          label="Source" /* {{filter_source}} */
          value={sourceFilter}
          options={sources}
          onChange={setSourceFilter}
        />
      </section>

      {/* Table */}
      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="text-[10px] font-mono text-gray-500">
            {/* {{lead_name}} · {{lead_email}} · {{lead_service}} · {{lead_status}} · {{lead_created_at}} */}
            {`{{lead_name}} · {{lead_email}} · {{lead_service}} · {{lead_status}} · {{lead_created_at}}`}
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{mockLeads.length}</span> results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Lead</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Service</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Source</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Budget</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Created</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockLeads.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center font-heading font-black text-amber text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{lead.name}</p>
                        <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300">{lead.service}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs">{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className={statusClasses(lead.status)}>{lead.status}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-300 text-xs font-mono">
                    {lead.budget}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs font-mono">
                    {lead.created}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:gap-2 transition-all"
                    >
                      View Lead <HiArrowRight className="text-sm" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter dropdown (placeholder styling)                            */
/* ------------------------------------------------------------------ */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative lg:min-w-[200px]">
      <p className="text-[9px] font-mono text-gray-600 mb-0.5 pl-1">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-black border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:border-amber/50 focus:outline-none transition-colors cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} className="bg-black text-white">
              {opt}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base" />
      </div>
    </div>
  );
}

function statusClasses(s: string) {
  switch (s) {
    case "new":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber/15 text-amber border border-amber/20";
    case "qualified":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
    case "in-review":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10";
    case "won":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber text-black";
    case "lost":
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10";
    default:
      return "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10";
  }
}
