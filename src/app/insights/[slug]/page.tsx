import type { Metadata } from "next";
import { insights } from "@/data/insights";
import { InsightContent } from "./InsightContent";

type Props = {
  params: Promise<{ slug: string }>;
};

/* generateMetadata intentionally reads from the static list. The CMS
   client-side `useCms` in `InsightContent` is what serves the rendered
   body, but for SEO the metadata should still resolve for slugs that
   exist statically. CMS-only slugs get the generic "Not Found" title
   — a follow-up can swap this for a server-side Supabase read if CMS
   metadata becomes a priority. */
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
  return <InsightContent slug={slug} />;
}
