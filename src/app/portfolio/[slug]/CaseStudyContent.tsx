"use client";

import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiArrowLeft,
  HiArrowRight,
  HiStar,
  HiUser,
  HiBuildingOffice2,
  HiClock,
  HiSquares2X2,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiCodeBracket,
  HiRocketLaunch,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import type { Project } from "@/data/projects";
import { testimonials } from "@/data/testimonials";

const overviewFields = [
  { label: "Client", icon: HiUser },
  { label: "Industry", icon: HiBuildingOffice2 },
  { label: "Timeline", icon: HiClock },
  { label: "Services", icon: HiSquares2X2 },
] as const;

const staticProcessSteps: Array<{ icon: ElementType; title: string; desc: string }> = [
  {
    icon: HiMagnifyingGlass,
    title: "Discovery",
    desc: "Research, audit & scoping the problem space.",
  },
  { icon: HiPencilSquare, title: "Design", desc: "Strategy, identity, and rapid prototyping." },
  { icon: HiCodeBracket, title: "Build", desc: "Engineering, integration, and quality assurance." },
  { icon: HiRocketLaunch, title: "Launch", desc: "Deploy, measure, and continue to optimize." },
];

export function CaseStudyContent({ project }: { project: Project }) {
  const router = useRouter();
  const testimonial = testimonials.find((t) => {
    const role = t.role.toLowerCase();
    const client = project.client.toLowerCase().split(/[\s(]/)[0] ?? "";
    return client.length >= 3 && role.includes(client);
  });
  const processSteps =
    project.services.length >= 4
      ? project.services.slice(0, 4).map((title, idx) => ({
          icon: staticProcessSteps[idx].icon,
          title,
          desc: staticProcessSteps[idx].desc,
        }))
      : staticProcessSteps;
  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-6">
                {project.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.05] md:leading-[0.95] tracking-tight mb-4 text-white">
                {project.title}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
                {project.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {overviewFields.map(({ label, icon: Icon }) => {
              const value =
                label === "Client"
                  ? project.client
                  : label === "Industry"
                    ? project.industry
                    : label === "Timeline"
                      ? project.timeline
                      : project.services.join(" \u00B7 ");
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card-dark border border-white/5 rounded-xl p-5 md:p-6"
                >
                  <Icon className="text-amber text-xl mb-3" />
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                    {label}
                  </div>
                  <div className="text-white text-sm md:text-base font-medium leading-snug">
                    {value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
                Challenge
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-6 text-white">
              The Problem
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {project.challenge}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
                Solution
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-6 text-white">
              What We Did
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {project.solution}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
              Our Process
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-10 text-white">
            {processSteps.map((s, i) => (
              <span key={s.title}>
                {i > 0 && <span className="text-amber/60">{" \u2192 "}</span>}
                {s.title}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative bg-[#1E1E1E] border border-white/5 rounded-xl p-5 md:p-6"
              >
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber/30 text-lg">
                    <HiArrowRight />
                  </div>
                )}
                <div className="text-amber font-heading font-black text-xl md:text-2xl leading-none opacity-30 mb-3">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <step.icon className="text-amber text-xl mb-2" />
                <h3 className="text-white font-bold text-sm md:text-base mb-1.5">{step.title}</h3>
                <p className="text-gray-400 text-xs md:text-[13px] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {project.results.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
                  Results
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-8 text-white">
                Numbers That <span className="text-amber">Moved</span>
              </h2>
              <div className="grid gap-4">
                {project.results.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 bg-card-dark rounded-xl border border-white/5 p-4"
                  >
                    <HiCheckCircle className="text-amber text-lg mt-0.5 shrink-0" />
                    <span className="text-gray-200 text-sm md:text-base font-medium">{result}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card-dark rounded-2xl border border-white/5 p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <HiStar key={i} className="text-amber text-lg" />
                ))}
              </div>
              <p className="text-white text-base md:text-xl leading-relaxed font-medium italic mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center text-amber font-heading font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
                Gallery
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-10 text-white">
              Selected <span className="text-amber">Visuals</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="rounded-xl overflow-hidden border border-white/5 hover:border-amber/30 transition-colors"
                >
                  <img
                    src={src}
                    alt={`${project.title} \u2014 visual ${i + 1}`}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-8 sm:p-12 text-center"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase mb-4">
              Start Your Project
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight mb-3 text-white">
              Want an outcome like this?
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Same rigor, same playbook — applied to your business and measured by your metrics.
            </p>{" "}
            <a
              href="/#contact"
              className="group inline-flex px-8 sm:px-12 py-4 sm:py-5 bg-amber text-black font-bold rounded-xl items-center justify-center gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] active:scale-95 text-base sm:text-lg"
            >
              Start your project with Stratifit
              <HiArrowRight className="group-hover:translate-x-1 transition-transform text-xl" />
            </a>
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
