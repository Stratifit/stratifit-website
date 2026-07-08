"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projects, projectCategories } from "@/data/projects";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-glow rounded-full blur-[120px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              Our{" "}
              <span className="text-amber">Work</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              We craft digital experiences that define industries and elevate
              brands through precision and creativity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Projects Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-10">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm shrink-0 transition-all ${
                  activeFilter === cat
                    ? "bg-amber text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    : "bg-white/5 border border-white/10 text-white hover:border-amber/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-heading font-bold text-xl text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider hover:text-amber-light transition-colors group/link"
                    >
                      View Case Study
                      <HiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 bg-card-dark border border-white/5 rounded-2xl px-8 py-6">
                <p className="text-gray-400 text-base font-medium">
                  No projects found in{" "}
                  <span className="text-amber font-bold">{activeFilter}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="fixed top-16 lg:top-20 left-1 z-50 p-2 rounded-full bg-white/5 backdrop-blur-sm transition-colors"
        aria-label="Go back"
      >
        <HiArrowLeft className="text-white hover:text-amber text-xl transition-colors" />
      </motion.button>
    </main>
  );
}
