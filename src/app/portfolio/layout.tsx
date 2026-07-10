import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Stratifit",
  description:
    "We craft digital experiences that define industries and elevate brands through precision and creativity.",
  openGraph: {
    title: "Our Work | Stratifit",
    description:
      "Digital experiences that define industries and elevate brands through precision and creativity.",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
