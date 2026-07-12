"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import Link from "next/link";
import { projects as fallbackProjects, projectCategories } from "@/data/projects";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, ta, type ProjectItem } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";

interface ProjectData {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  shortMetric: string;
  shortLabel: string;
}

const FALLBACK_PROJECTS: ProjectData[] = fallbackProjects
  .slice(0, 8)
  .map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category, description: p.description, image: p.image, shortMetric: p.shortMetric, shortLabel: p.shortLabel }));

// Map raw category names (from data/projects.ts) to translation keys.
const CATEGORY_KEYS: Record<string, string> = {
  "All": "cat_all",
  "Brand Design": "cat_brand_design",
  "Web Development": "cat_web_dev",
  "AI & Automation": "cat_ai_automation",
  "Growth Marketing": "cat_growth_marketing",
};

export function Portfolio() {
  const { lang } = useLanguage();
  const { data: cmsProjects } = useCms<ProjectItem[]>("projects", { fallback: [] });

  const allProjects: ProjectData[] =
    cmsProjects && cmsProjects.length > 0
      ? [...cmsProjects]
          .filter((p) => p.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => ({
            id: p.id,
            // Use the human-readable slug (not the UUID) so the link
            // resolves on the detail page, which now looks up by slug
            // via useCms('projects').
            slug: p.slug,
            title: t(p.title, lang),
            category: p.category,
            description: t(p.description, lang),
            image: p.image,
            shortMetric: p.short_metric,
            shortLabel: t(p.short_label, lang),
          }))
      : FALLBACK_PROJECTS;

  const featuredProjects = allProjects.slice(0, 8);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth >= 768 ? 380 : window.innerWidth >= 640 ? 340 : 300;
    const gap = 24;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const filtered =
    activeFilter === "All"
      ? featuredProjects
      : featuredProjects.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = 320;
      const gap = 24;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActivePortfolioIndex(Math.max(0, Math.min(idx, filtered.length - 1)));
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [filtered.length, activeFilter]);

  return (
    <section id="work" className="py-24 md:py-32 bg-surface relative overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">{tLabel("portfolio_label", lang)}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            {tLabel("portfolio_title_prefix", lang)} <span className="text-amber">{tLabel("portfolio_title_highlight", lang)}</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            {tLabel("portfolio_subtitle", lang)}
          </p>
        </motion.div>

        {/* Filters */}
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
              {tLabel(CATEGORY_KEYS[cat] || cat, lang)}
            </button>
          ))}
        </div>

        {/* Projects - Single horizontal scroll line */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
          >
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-center"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-heading font-bold text-xl text-white">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider hover:text-amber-light transition-colors group/link"
                  >
                    {tLabel("view_case_study", lang)}
                    <HiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Left/Right Scroll Arrows */}
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll portfolio left"
            className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            aria-label="Scroll portfolio right"
            className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
          >
            <HiArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop View All */}
        <div className="hidden md:flex justify-end mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-amber text-sm font-bold uppercase tracking-wider hover:text-amber-light transition-colors group"
          >
            {tLabel("view_all_projects", lang)}
            <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dot Indicators + View All */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative">
          {filtered.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-200 ease-out ${
                i === activePortfolioIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
              }`}
            />
          ))}
          <Link
            href="/portfolio"
            className="md:hidden absolute right-0 inline-flex items-center gap-1 text-amber text-[10px] font-bold uppercase tracking-wider hover:text-amber-light transition-colors"
          >
            View All
            <HiArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
