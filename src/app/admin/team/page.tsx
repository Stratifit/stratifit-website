"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiUserGroup,
  HiCheckCircle,
  HiXMark,
  HiMagnifyingGlass,
} from "react-icons/hi2";

const members = [
  { id: "u-1", name: "Roan Carter", email: "roan@stratifit.com", role: "Owner", initials: "RC", active: true, joined: "2024-09-12" },
  { id: "u-2", name: "Avery Lin", email: "avery@stratifit.com", role: "Editor", initials: "AL", active: true, joined: "2025-01-04" },
  { id: "u-3", name: "Mira Solis", email: "mira@stratifit.com", role: "Editor", initials: "MS", active: true, joined: "2025-03-22" },
  { id: "u-4", name: "Theo Park", email: "theo@stratifit.com", role: "Viewer", initials: "TP", active: true, joined: "2025-06-10" },
  { id: "u-5", name: "Nia Castello", email: "nia@stratifit.com", role: "Editor", initials: "NC", active: false, joined: "2024-12-30" },
];

const roles = ["All", "Owner", "Editor", "Viewer"];

export default function AdminTeamPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
            System
          </p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Team
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage admin users, roles, and access.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95">
          <HiPlus className="text-base" /> Invite member
        </button>
      </header>

      <section className="bg-card-dark rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members"
            className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none"
          />
        </label>
        <div className="flex gap-2 items-center">
          <p className="text-[10px] font-mono text-gray-600">filter.role</p>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                role === r ? "bg-amber text-black border-amber" : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-mono text-gray-500">
            user.name · user.email · user.role · user.active
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{members.filter((m) => m.active).length}</span> active
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-6 py-3 font-bold">Member</th>
                <th className="px-6 py-3 font-bold hidden md:table-cell">Email</th>
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members
                .filter((m) => role === "All" || m.role === role)
                .map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center font-heading font-black text-amber">
                        {m.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{m.name}</p>
                        <p className="text-[10px] font-mono text-gray-600">{m.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-300 text-xs font-mono">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      m.role === "Owner" ? "bg-amber/15 text-amber border border-amber/20"
                        : m.role === "Editor" ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs font-mono">{m.joined}</td>
                  <td className="px-6 py-4">
                    {m.active ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 inline-flex items-center gap-1">
                        <HiCheckCircle className="text-[10px]" /> active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 inline-flex items-center gap-1">
                        <HiXMark className="text-[10px]" /> suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs text-amber font-bold hover:underline">Manage</button>
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
