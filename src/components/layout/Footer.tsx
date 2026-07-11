"use client";

import { FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { openContactModal } from "@/components/contact/ContactModal";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, emptyTranslatableString, type Language, type FooterContent } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";

const footerLinkKeys: Record<string, { labelKey: string; href?: string; action?: string }[]> = {
  platform: [
    { labelKey: "home", href: "/" },
    { labelKey: "services", href: "/#services" },
    { labelKey: "work", href: "/portfolio" },
    { labelKey: "insights", href: "/insights" },
  ],
  company: [
    { labelKey: "about", href: "/about" },
    { labelKey: "careers", href: "/about" },
    { labelKey: "contact", action: "contact" },
  ],
  legal_col: [
    { labelKey: "privacy", href: "/privacy-policy" },
    { labelKey: "terms", href: "/terms-conditions" },
    { labelKey: "cookies", href: "/cookie-policy" },
  ],
};

export function Footer() {
  const { lang } = useLanguage();
  const { data: cmsFooter } = useCms<FooterContent>("footer_content", {
    fallback: {
      id: "",
      // Empty so the `t() || tLabel("tagline", lang)` chain actually triggers
      // for non-English languages (instead of returning the same English
      // string for all 4 languages).
      tagline: emptyTranslatableString(),
      columns: [],
      social_links: [],
    },
  });

  const tagline = t(cmsFooter?.tagline, lang) || tLabel("tagline", lang);

  // Use CMS footer links if available, otherwise fall back to the
  // key-based static fallback (translated via tLabel()).
  const columns: Record<string, { label: string; href?: string; action?: string }[]> =
    cmsFooter?.columns?.length
      ? cmsFooter.columns.reduce<Record<string, { label: string; href?: string; action?: string }[]>>((acc, col) => {
          const titleKey = t(col.title, lang) || col.title.en || "";
          if (titleKey) {
            acc[titleKey] = col.links.map((link) => ({
              label: t(link.label, lang),
              href: link.href,
              action: link.action ?? undefined,
            }));
          }
          return acc;
        }, {})
      : Object.fromEntries(
          Object.entries(footerLinkKeys).map(([titleKey, links]) => [
            tLabel(titleKey, lang),
            links.map((link) => ({
              label: tLabel(link.labelKey, lang),
              href: link.href,
              action: link.action,
            })),
          ]),
        );
  return (
    <footer id="site-footer" className="bg-[#0a0a0a] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col gap-10">
          {/* Logo + tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber rounded flex items-center justify-center shrink-0">
                <span className="text-black font-extrabold text-[10px]">SF</span>
              </div>
              <span className="font-heading font-extrabold text-base tracking-tight uppercase text-white">
                Stratifit
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium max-w-[80%] leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title} className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  {title}
                </h4>
                {links.map((link) =>
                  link.action === "contact" ? (
                    <button
                      key={link.label}
                      onClick={openContactModal}
                      className="text-xs text-gray-400 hover:text-amber transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-amber transition-colors"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex gap-4">
            {[
              { icon: FaLinkedinIn, label: "LinkedIn" },
              { icon: FaXTwitter, label: "Twitter" },
              { icon: FaInstagram, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group hover:border-amber/50 transition-colors bg-white/5"
              >
                <Icon className="w-4 h-4 text-amber group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>

          {/* Copyright + Back to Top */}
          <div className="space-y-4">
            <div className="h-px w-full bg-amber/30" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-gray-500 font-medium">
                &copy; {new Date().getFullYear()} Stratifit. {tLabel("all_rights_reserved", lang)}.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[10px] text-amber font-bold hover:text-white transition-colors uppercase tracking-wider"
              >
                {tLabel("back_to_top", lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
