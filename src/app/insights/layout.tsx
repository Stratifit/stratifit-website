import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Expertise | Stratifit",
  description:
    "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.",
  openGraph: {
    title: "Insights & Expertise | Stratifit",
    description:
      "Thought leadership, industry perspectives, and actionable strategies from our team.",
    type: "website",
  },
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
