import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insights } from "@/data/insights";
import { InsightContent } from "./InsightContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = insights.find((i) => i.slug === slug);

  if (!insight) {
    return {
      title: "Not Found | Stratifit",
      description: "This insight article could not be found.",
    };
  }

  return {
    title: `${insight.title} | Stratifit Insights`,
    description: insight.excerpt,
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      images: [insight.image],
      type: "article",
      publishedTime: insight.date,
    },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const insight = insights.find((i) => i.slug === slug);

  if (!insight) {
    notFound();
  }

  return <InsightContent insight={insight} />;
}
