"use client";

import { motion } from "framer-motion";
import { HiCheckCircle, HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";

export function CaseStudyContent({ project }: { project: Project }) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-black">
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-4">{project.category}</span>
          </div>
        </div>
      </section>
      <section className="pb-4 -mt-16 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">{project.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-12">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-medium text-amber bg-amber/10 border border-amber/20 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
              <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">The Challenge</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">{project.challenge}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-12">
              <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Our Solution</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">{project.solution}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-6">Results</h2>
              <div className="grid gap-4">
                {project.results.map((result, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} className="flex items-start gap-3 bg-card-dark rounded-xl border border-white/5 p-4">
                    <HiCheckCircle className="text-amber text-lg mt-0.5 shrink-0" />
                    <span className="text-gray-200 text-sm md:text-base font-medium">{result}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
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
            router.push("/portfolio");
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
