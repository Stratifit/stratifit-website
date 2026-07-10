"use client";

import { FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { openContactModal } from "@/components/contact/ContactModal";

const footerLinks: Record<string, { label: string; href?: string; action?: string }[]> = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/portfolio" },
    { label: "Insights", href: "/insights" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/about" },
    { label: "Contact", action: "contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 relative">
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
              Digital excellence, built from foundation to full scale.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(footerLinks).map(([title, links]) => (
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
                &copy; {new Date().getFullYear()} Stratifit. All rights reserved.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[10px] text-amber font-bold hover:text-white transition-colors uppercase tracking-wider"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
