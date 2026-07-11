"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AIChatbot } from "@/components/chat/AIChatbot";
import { openContactModal } from "@/components/contact/ContactModal";
import { useLanguage } from "@/lib/LanguageContext";
import { useCms } from "@/lib/use-cms";
import { t, type HeaderNavLink, type SiteSettings } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";
import { LanguageDropdown } from "@/components/layout/LanguageDropdown";
import { HiMenu, HiX } from "react-icons/hi";
import {
  HiChevronUp,
  HiSparkles,
  HiCommandLine,
  HiMegaphone,
  HiCpuChip,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Hardcoded-label translations live in `src/lib/stratifit-i18n.ts`  */
/*  and are consumed via `tLabel(key, lang)`. They cover chrome that   */
/*  isn't CMS-driven (or as a fallback when the relevant CMS table is  */
/*  empty).                                                            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Static fallback data (used when Supabase is not configured)       */
/* ------------------------------------------------------------------ */

const serviceTiles = [
  { icon: HiSparkles, labelKey: "branding", href: "/brand-design" },
  { icon: HiCommandLine, labelKey: "development", href: "/website-development" },
  { icon: HiMegaphone, labelKey: "marketing", href: "/growth-marketing" },
  { icon: HiCpuChip, labelKey: "automation", href: "/ai-automation" },
];

interface NavLink {
  label: string;
  href?: string;
  action?: string;
  isCta?: boolean;
  ctaText?: string;
}

interface FallbackNavItem {
  labelKey: string;
  href?: string;
  action?: string;
}

const FALLBACK_NAV: FallbackNavItem[] = [
  { labelKey: "home", href: "/" },
  { labelKey: "services", href: "#services" },
  { labelKey: "work", href: "/portfolio" },
  { labelKey: "insights", href: "/insights" },
  { labelKey: "about", href: "/about" },
  { labelKey: "faq", href: "#faq" },
  { labelKey: "contact", action: "contact" },
];

/**
 * Built once from FALLBACK_NAV: maps href (or action) to the tLabel() key.
 * Used as a defensive fallback when a CMS row exists but its `label` JSONB
 * is empty (e.g. inserted via SQL seed without filling the admin editor).
 * Keeping this derived from FALLBACK_NAV means new links only need to be
 * added in one place.
 */
const DEFAULT_LABEL_BY_HREF: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const item of FALLBACK_NAV) {
    if (item.href) map[item.href] = item.labelKey;
    if (item.action) map[`action:${item.action}`] = item.labelKey;
  }
  return map;
})();

function getDefaultLabelKey(href: string | undefined, action: string | null | undefined): string | null {
  if (action) {
    const byAction = DEFAULT_LABEL_BY_HREF[`action:${action}`];
    if (byAction) return byAction;
  }
  if (href) {
    const byHref = DEFAULT_LABEL_BY_HREF[href];
    if (byHref) return byHref;
  }
  return null;
}

const FALLBACK_SITE_NAME_KEY = "stratifit";
const FALLBACK_TAGLINE_KEY = "digital_excellence";
const FALLBACK_CTA_KEY = "start_project";
const FALLBACK_LOGO_TEXT = "SF";

export function Header() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  // CMS: nav links
  const { data: cmsNavLinks } = useCms<HeaderNavLink[]>("header_nav_links", {
    fallback: [],
  });

  // CMS: site settings (logo, tagline)
  const { data: cmsSettings } = useCms<SiteSettings>("site_settings", {
    fallback: undefined,
  });

  // Merge CMS nav with fallback. Fallback items are translated via tLabel()
  // so the same code path serves both the unconfigured-Supabase case AND the
  // active-language switcher on the static data.
  //
  // Defensive fallback: if the CMS row exists but its `label` JSONB is empty
  // (e.g. a row was inserted by the seed but the admin hasn't filled labels
  // yet, or the migration's default `'{}'` was used), fall back to the
  // tLabel() key derived from the href/action. This guarantees the menu
  // always renders a visible label for known links.
  const navLinks: NavLink[] =
    cmsNavLinks && cmsNavLinks.length > 0
      ? [...cmsNavLinks]
          .sort((a, b) => a.sort_order - b.sort_order)
          .filter((l) => l.is_active)
          .map((l) => {
            const translated = t(l.label, lang);
            const fallbackKey = getDefaultLabelKey(l.href, l.action);
            const label = translated || (fallbackKey ? tLabel(fallbackKey, lang) : l.href || "");
            return {
              label,
              href: l.action != null ? undefined : l.href,
              action: l.action || undefined,
              isCta: l.is_cta,
              ctaText: t(l.cta_text, lang),
            };
          })
      : FALLBACK_NAV.map((item) => ({
          label: tLabel(item.labelKey, lang),
          href: item.href,
          action: item.action,
        }));

  // Separate CTA link from nav (only contact-modal CTAs get special treatment)
  const ctaLink = navLinks.find((l) => l.isCta && l.action === "contact");
  const displayNav = navLinks.filter((l) => !(l.isCta && l.action === "contact"));
  const ctaText = ctaLink?.ctaText || tLabel(FALLBACK_CTA_KEY, lang);
  const siteName =
    t(cmsSettings?.site_name, lang) || tLabel(FALLBACK_SITE_NAME_KEY, lang);
  const tagline =
    t(cmsSettings?.site_tagline, lang) || tLabel(FALLBACK_TAGLINE_KEY, lang);
  const logoText = cmsSettings?.logo_text || FALLBACK_LOGO_TEXT;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !servicesOpen || !isOpen) return;

    const handleScroll = () => {
      const cardWidth = 120;
      const gap = 8;
      const padding = 24;
      const centerPosition = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
      const cardIndex = Math.round((centerPosition - padding) / (cardWidth + gap));
      setActiveCardIndex(Math.max(0, Math.min(cardIndex, serviceTiles.length - 1)));
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [servicesOpen, isOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        id="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-white/5"
            : "bg-black border-b border-white/5"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 lg:h-20">
          {/* Mobile: Menu icon on left */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            className="lg:hidden p-3 -ml-3 text-white order-1 pointer-events-auto"
            aria-label={tLabel("toggle_menu", lang)}
          >
            <HiMenu size={24} />
          </button>

          {/* Desktop: Logo on left */}
          <Link href="/" className="hidden lg:flex items-center gap-2.5 group shrink-0 order-1">
            <div className="w-9 h-9 bg-amber rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <span className="text-black font-black text-xs tracking-tighter">{logoText}</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-black text-lg tracking-tight uppercase text-white">
                {siteName}
              </span>
              <span className="text-[8px] font-bold text-amber tracking-[0.2em] uppercase">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop: Nav links center */}
          <div className="hidden lg:flex items-center gap-8 order-2 lg:pl-40">
            {displayNav.map((link) => {
              if (link.action === "contact") {
                return (
                  <button
                    key={link.label}
                    onClick={openContactModal}
                    className="relative text-sm font-medium tracking-wide transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-[2px] after:bg-amber after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out text-gray-300 hover:text-amber"
                  >
                    {link.label}
                  </button>
                );
              }
              const active =
                link.href &&
                !link.href.startsWith("#") &&
                (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href));
              return (
                <a
                  key={link.label}
                  href={link.href ?? "#"}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-[2px] after:bg-amber after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out ${
                    active ? "text-amber" : "text-gray-300 hover:text-amber"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Mobile: Logo centered */}            <Link
              href="/"
              className="lg:hidden flex items-center gap-2 group shrink-0 order-2 absolute left-1/2 -translate-x-1/2"
            >
              <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                <span className="text-black font-black text-[10px] tracking-tighter">{logoText}</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black text-base tracking-tight uppercase text-white">
                  {siteName}
                </span>
              </div>
            </Link>

          {/* Desktop: Language dropdown + CTA right */}
          <div className="hidden lg:flex items-center gap-3 order-3">
            <LanguageDropdown size="md" />
            <button
              onClick={openContactModal}
              className="px-6 py-2.5 bg-amber text-black font-bold text-sm rounded-full hover:bg-amber-light transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile: AI Chatbot */}
          <div className="lg:hidden order-3">
            <AIChatbot />
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] lg:hidden bg-black flex flex-col h-[100dvh] overflow-hidden"
          >
            {/* Header - matches home */}
            <div className="flex-none px-4 py-3 flex items-center justify-between border-b border-white/10 h-16">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                <span className="text-black font-black text-[10px] tracking-tighter">{logoText}</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black text-base tracking-tight uppercase text-white">
                  {siteName}
                </span>
              </div>
            </Link>
              <div className="flex items-center gap-1">
                <LanguageDropdown size="sm" />
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={tLabel("close_menu", lang)}
                  className="p-3 text-white hover:text-amber transition-colors focus:outline-none"
                >
                  <HiX size={24} />
                </button>
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col justify-between px-6 py-3 overflow-y-auto menu-scroll">
              <nav className="flex flex-col gap-0 mt-1">
                {/* Home - always first */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between py-3 border-b border-white/10"
                >
                  <span className="text-2xl font-heading font-black text-white group-hover:text-amber transition-colors">
                    {tLabel("home", lang)}
                  </span>
                </Link>

                {/* Services - expandable */}
                <div className="flex flex-col border-b border-white/10 pb-3 mb-1">
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="group w-full text-left pt-2 pb-3 flex items-center justify-between"
                  >
                    <span className="text-2xl font-heading font-black text-white group-hover:text-amber transition-colors">
                      {tLabel("services", lang)}
                    </span>
                    <HiChevronUp
                      size={26}
                      className={`transition-transform duration-300 ${
                        servicesOpen ? "text-amber" : "text-white group-hover:text-amber"
                      } ${servicesOpen ? "" : "rotate-180"}`}
                    />
                  </button>
                  {servicesOpen && (
                    <>
                      <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-2 pb-1 -mx-6 px-6 menu-scroll snap-x"
                      >
                        {serviceTiles.map((s) => (
                          <a
                            key={s.labelKey}
                            href={s.href}
                            onClick={() => setIsOpen(false)}
                            className="snap-start flex-none w-[120px] bg-card-dark rounded-xl p-3 flex flex-col items-center justify-center gap-2 border border-white/5 hover:border-amber/50 transition-colors cursor-pointer"
                          >
                            <s.icon className="text-amber text-2xl" />
                            <span className="text-xs font-medium text-white">
                              {tLabel(s.labelKey, lang)}
                            </span>
                          </a>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        {serviceTiles.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-200 ease-out ${
                              i === activeCardIndex
                                ? "w-1.5 h-1.5 bg-amber"
                                : "w-1.5 h-1.5 bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Other nav items — from CMS with Home & Services filtered out (those are handled above) */}
                {displayNav
                  .filter((l) => l.href !== "/" && l.href !== "#services")
                  .map((item) => (
                  <a
                    key={item.label}
                    href={item.href ?? "#"}
                    onClick={(e) => {
                      if (item.action === "contact") {
                        e.preventDefault();
                        setIsOpen(false);
                        openContactModal();
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className="group flex items-center justify-between py-3 border-b border-white/10"
                  >
                    <span className="text-2xl font-heading font-black text-white group-hover:text-amber transition-colors">
                      {item.label}
                    </span>
                  </a>
                ))}
              </nav>

              {/* Footer links */}
              <div className="mb-2 text-center">
                <p className="text-[0.7rem] text-white/70 font-medium tracking-wide">
                  <Link
                    className="hover:text-white transition-colors"
                    href="/privacy-policy"
                    onClick={() => setIsOpen(false)}
                  >
                    {tLabel("privacy", lang)}
                  </Link>
                  <span className="mx-1">.</span>
                  <Link
                    className="hover:text-white transition-colors"
                    href="/terms-conditions"
                    onClick={() => setIsOpen(false)}
                  >
                    {tLabel("terms", lang)}
                  </Link>
                  <span className="mx-1">.</span>
                  <Link
                    className="hover:text-white transition-colors"
                    href="/cookie-policy"
                    onClick={() => setIsOpen(false)}
                  >
                    {tLabel("cookies", lang)}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
