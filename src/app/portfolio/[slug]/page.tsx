import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { CaseStudyContent } from "./CaseStudyContent";

type Props = {
  params: Promise<{ slug: string }>;
};

/* generateMetadata intentionally reads from the static list. The CMS
   client-side `useCms` in `CaseStudyContent` is what serves the
   rendered body, but for SEO the metadata should still resolve for
   slugs that exist statically. CMS-only slugs get the generic
   "Not Found" title — a follow-up can swap this for a server-side
   Supabase read if CMS metadata becomes a priority. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Not Found | Stratifit",
      description: "This case study could not be found.",
    };
  }

  return {
    title: `${project.title} — Case Study | Stratifit`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      images: [project.image],
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  return <CaseStudyContent slug={slug} />;
}
