"use client";

import { motion } from "framer-motion";

const toolsRow1 = [
  { name: "Next.js", color: "text-white" },
  { name: "Tailwind CSS", color: "text-cyan-400" },
  { name: "Framer Motion", color: "text-pink-400" },
  { name: "GSAP", color: "text-green-400" },
  { name: "React", color: "text-blue-400" },
  { name: "TypeScript", color: "text-blue-500" },
  { name: "Vercel", color: "text-white" },
  { name: "OpenAI", color: "text-green-300" },
  { name: "Make.com", color: "text-purple-400" },
  { name: "Vapi", color: "text-indigo-400" },
];

const toolsRow2 = [
  { name: "Tidio AI", color: "text-blue-300" },
  { name: "Resend", color: "text-white" },
  { name: "Meta Ads", color: "text-blue-400" },
  { name: "Google Ads", color: "text-yellow-400" },
  { name: "TikTok Ads", color: "text-white" },
  { name: "GA4", color: "text-orange-400" },
  { name: "Hotjar", color: "text-red-400" },
  { name: "HubSpot", color: "text-orange-500" },
  { name: "Spline", color: "text-pink-300" },
  { name: "Rive", color: "text-teal-400" },
];

export function ToolsIntegrations() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Our Stack</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Tools &amp; <span className="text-amber">Integrations</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            We use the best tools in the industry to build, automate, and scale your digital
            presence.
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Row 1 */}
          <div className="overflow-hidden">
            <div className="flex animate-ticker-slow">
              {[...toolsRow1, ...toolsRow1].map((tool, i) => (
                <div
                  key={i}
                  className="shrink-0 px-5 sm:px-8 py-3 sm:py-4 mx-1.5 sm:mx-2 bg-card-dark rounded-xl border border-white/5 flex items-center gap-2 sm:gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-amber shrink-0" />
                  <span
                    className={`text-xs sm:text-sm font-heading font-bold ${tool.color} whitespace-nowrap`}
                  >
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - reversed */}
          <div className="overflow-hidden">
            <div className="flex animate-ticker-slow-reverse">
              {[...toolsRow2, ...toolsRow2].map((tool, i) => (
                <div
                  key={i}
                  className="shrink-0 px-5 sm:px-8 py-3 sm:py-4 mx-1.5 sm:mx-2 bg-card-dark rounded-xl border border-white/5 flex items-center gap-2 sm:gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-amber shrink-0" />
                  <span
                    className={`text-xs sm:text-sm font-heading font-bold ${tool.color} whitespace-nowrap`}
                  >
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
