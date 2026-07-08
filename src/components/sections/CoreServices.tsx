"use client";

import { motion } from "framer-motion";
import { HiArrowRight, HiCheckCircle } from "react-icons/hi2";
import { MdDiamond, MdDesignServices, MdCode, MdRocketLaunch } from "react-icons/md";

const services = [
  {
    icon: MdDiamond,
    title: "Brand Design",
    href: "/brand-design",
    description:
      "Crafting unique identities that resonate and leave a lasting impression on your market.",
    deliverables: [
      "Brand Strategy",
      "Logo Design",
      "Visual Identity",
      "Brand Guidelines",
    ],
  },
  {
    icon: MdDesignServices,
    title: "Website Development",
    href: "/website-development",
    description:
      "High-performance websites and web apps engineered for speed, scale, and conversion.",
    deliverables: [
      "Custom Websites",
      "E‑commerce",
      "Web Applications",
      "CMS Integration",
    ],
  },
  {
    icon: MdCode,
    title: "AI & Automation",
    href: "/ai-automation",
    description:
      "Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.",
    deliverables: [
      "AI Lead Qualification",
      "AI Chatbots",
      "Workflow Automation",
      "Custom APIs",
    ],
  },
  {
    icon: MdRocketLaunch,
    title: "Growth & Marketing",
    href: "/growth-marketing",
    description:
      "Data-driven campaigns that amplify your brand and drive measurable revenue growth.",
    deliverables: [
      "Performance Marketing",
      "SEO & SEM",
      "Content Strategy",
      "Social Media",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function CoreServices() {
  return (
    <section id="services" className="pt-2 pb-12 md:pt-4 md:pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Services</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Our Core{" "}
            <span className="text-amber">Services</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            Strategic solutions engineered to scale your digital presence with
            precision and luxury.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="visible"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group bg-card-dark rounded-[32px] p-7 border border-white/5 relative overflow-hidden hover:border-amber/20 transition-all duration-500 shadow-xl shadow-black/50 flex flex-col"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <service.icon className="text-amber text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-2 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-amber font-bold mb-4 opacity-90">
                    Key Deliverables
                  </p>
                  <ul className="space-y-3">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <HiCheckCircle className="text-amber text-lg shrink-0 mt-[-1px]" />
                        <span className="text-sm text-gray-300 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1" />

                <a
                  href={service.href}
                  className="mt-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-amber hover:bg-amber/5 hover:border-amber/30 transition-all group/link"
                >
                  Learn More
                  <HiArrowRight className="text-lg group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
