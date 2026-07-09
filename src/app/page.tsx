"use client";

import dynamic from "next/dynamic";

const Hero = dynamic(
  () => import("@/components/sections/Hero").then((m) => ({ default: m.Hero })),
  { ssr: true }
);
const CoreServices = dynamic(
  () =>
    import("@/components/sections/CoreServices").then((m) => ({
      default: m.CoreServices,
    })),
  { ssr: true }
);
const Process = dynamic(
  () =>
    import("@/components/sections/Process").then((m) => ({
      default: m.Process,
    })),
  { ssr: true }
);
const WhyChooseUs = dynamic(
  () =>
    import("@/components/sections/WhyChooseUs").then((m) => ({
      default: m.WhyChooseUs,
    })),
  { ssr: true }
);
const Insights = dynamic(
  () =>
    import("@/components/sections/Insights").then((m) => ({
      default: m.Insights,
    })),
  { ssr: true }
);
const Portfolio = dynamic(
  () =>
    import("@/components/sections/Portfolio").then((m) => ({
      default: m.Portfolio,
    })),
  { ssr: true }
);
const BuyBusinessSection = dynamic(
  () =>
    import("@/components/sections/BuyBusinessSection").then((m) => ({
      default: m.BuyBusinessSection,
    })),
  { ssr: true }
);
const Testimonials = dynamic(
  () =>
    import("@/components/sections/Testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  { ssr: true }
);
const Packages = dynamic(
  () =>
    import("@/components/sections/Packages").then((m) => ({
      default: m.Packages,
    })),
  { ssr: true }
);
const FAQ = dynamic(
  () =>
    import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })),
  { ssr: true }
);
const Contact = dynamic(
  () =>
    import("@/components/sections/Contact").then((m) => ({
      default: m.Contact,
    })),
  { ssr: true }
);

export default function Home() {
  return (
    <>
      <Hero />
      <CoreServices />
      <Process />
      <WhyChooseUs />
      <Insights />
      <Portfolio />
      <BuyBusinessSection />
      <Testimonials />
      <Packages />
      <FAQ />
      <Contact />
    </>
  );
}
