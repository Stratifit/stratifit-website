import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CaseStudyContent } from "./CaseStudyContent";

type Props = {
  params: Promise<{ slug: string }>;
};

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
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyContent project={project} />;
}
