import type { Language, TranslatableString } from "@/lib/cms-types";
import { emptyTranslatableString, emptyTranslatableArray } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Section Editor Config — defines which fields to show per section  */
/* ------------------------------------------------------------------ */

export interface EditorField {
  key: string;
  label: string;
  type: "text" | "textarea" | "richtext" | "array" | "string" | "number" | "boolean" | "json-array" | "json-object";
  required?: boolean;
  /** Only for translatable fields: if true, this is a simple string (not translatable). */
  plain?: boolean;
}

export interface SectionEditorConfig {
  title: string;
  description: string;
  table: string;
  /** If true, this is a single-row table (no add/delete). */
  single: boolean;
  /** List of translatable fields. */
  translatableFields: EditorField[];
  /** List of non-translatable fields. */
  plainFields: EditorField[];
}

/* ------------------------------------------------------------------ */
/*  All section editor configurations                                 */
/* ------------------------------------------------------------------ */

export const sectionEditorConfigs: Record<string, SectionEditorConfig> = {
  "site-settings": {
    title: "Site Settings",
    description: "Brand identity, logo, and global site configuration.",
    table: "site_settings",
    single: true,
    translatableFields: [
      { key: "site_name", label: "Site Name", type: "text", required: true },
      { key: "site_tagline", label: "Tagline", type: "text", required: true },
    ],
    plainFields: [
      { key: "logo_text", label: "Logo Text (max 2 chars)", type: "string" },
    ],
  },
  "header-nav": {
    title: "Header Navigation",
    description: "Navigation links in the website header.",
    table: "header_nav_links",
    single: false,
    translatableFields: [
      { key: "label", label: "Link Label", type: "text", required: true },
      { key: "cta_text", label: "CTA Button Text", type: "text" },
    ],
    plainFields: [
      { key: "href", label: "URL", type: "string", required: true },
      { key: "action", label: "Action (e.g. 'contact')", type: "string" },
      { key: "is_cta", label: "Is CTA Button?", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "footer": {
    title: "Footer Content",
    description: "Footer tagline, columns, and social links.",
    table: "footer_content",
    single: true,
    translatableFields: [
      { key: "tagline", label: "Footer Tagline", type: "text", required: true },
    ],
    plainFields: [
      { key: "columns", label: "Footer Columns (JSON)", type: "json-array" },
      { key: "social_links", label: "Social Links (JSON)", type: "json-array" },
    ],
  },
  "hero": {
    title: "Hero Section",
    description: "Main hero content, CTAs, stats, and tech stack.",
    table: "hero_content",
    single: true,
    translatableFields: [
      { key: "badge_text", label: "Badge Text", type: "text", required: true },
      { key: "heading_line1", label: "Heading Line 1", type: "text", required: true },
      { key: "heading_line2", label: "Heading Line 2", type: "text", required: true },
      { key: "subheading", label: "Subheading", type: "textarea", required: true },
      { key: "cta_primary", label: "Primary CTA Text", type: "text", required: true },
      { key: "cta_secondary", label: "Secondary CTA Text", type: "text", required: true },
      { key: "trusted_by_label", label: "Trusted By Label", type: "text" },
      { key: "tech_stack_label_prefix", label: "Tech Stack - Label Prefix", type: "text" },
      { key: "tech_stack_highlight", label: "Tech Stack - Highlight Word", type: "text" },
      { key: "tech_stack_label_suffix", label: "Tech Stack - Label Suffix", type: "text" },
      { key: "tech_stack_subtitle", label: "Tech Stack Subtitle", type: "textarea" },
    ],
    plainFields: [
      { key: "trusted_companies", label: "Trusted Companies (JSON)", type: "json-array" },
      { key: "stats", label: "Stats (JSON)", type: "json-array" },
      { key: "tech_stack_items", label: "Tech Stack Items (JSON)", type: "json-array" },
    ],
  },
  "services": {
    title: "Core Services",
    description: "Service cards shown on the homepage and services page.",
    table: "core_services",
    single: false,
    translatableFields: [
      { key: "title", label: "Service Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "deliverables", label: "Key Deliverables", type: "array" },
      { key: "cta_text", label: "CTA Text", type: "text" },
    ],
    plainFields: [
      { key: "icon", label: "React Icon Name", type: "string", required: true },
      { key: "href", label: "Page URL", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "process": {
    title: "Process Steps",
    description: "The 4-step process section on the homepage.",
    table: "process_steps",
    single: false,
    translatableFields: [
      { key: "title", label: "Step Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "step_number", label: "Step Number", type: "number", required: true },
      { key: "icon", label: "React Icon Name", type: "string", required: true },
    ],
  },
  "why-choose-us": {
    title: "Why Choose Us",
    description: "Section heading and benefit cards.",
    table: "why_choose_us_content",
    single: true,
    translatableFields: [
      { key: "section_label", label: "Section Label", type: "text" },
      { key: "section_title_prefix", label: "Title Prefix", type: "text" },
      { key: "section_title_highlight", label: "Title Highlight Word", type: "text" },
      { key: "section_title_suffix", label: "Title Suffix", type: "text" },
      { key: "section_subtitle", label: "Subtitle", type: "textarea" },
    ],
    plainFields: [],
  },
  "why-choose-us-benefits": {
    title: "Why Choose Us — Benefits",
    description: "Individual benefit cards.",
    table: "why_choose_us_benefits",
    single: false,
    translatableFields: [
      { key: "title", label: "Benefit Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "stat", label: "Stat Value", type: "text" },
      { key: "stat_label", label: "Stat Label", type: "text" },
    ],
    plainFields: [
      { key: "icon", label: "React Icon Name", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "about": {
    title: "About Page",
    description: "About page hero, mission, story, team, and CTA.",
    table: "about_page_content",
    single: true,
    translatableFields: [
      { key: "hero_title_prefix", label: "Hero Title Prefix", type: "text" },
      { key: "hero_title_highlight", label: "Hero Title Highlight", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "mission_text", label: "Mission Text", type: "textarea" },
      { key: "story_text", label: "Our Story Text", type: "richtext" },
      { key: "team_text", label: "Team Text", type: "richtext" },
      { key: "cta_title_prefix", label: "CTA Title Prefix", type: "text" },
      { key: "cta_title_highlight", label: "CTA Title Highlight", type: "text" },
      { key: "cta_subtitle", label: "CTA Subtitle", type: "text" },
      { key: "cta_button_text", label: "CTA Button Text", type: "text" },
    ],
    plainFields: [],
  },
  "about-stats": {
    title: "About Page — Stats",
    description: "Stat cards on the About page.",
    table: "about_stats",
    single: false,
    translatableFields: [
      { key: "label", label: "Stat Label", type: "text", required: true },
    ],
    plainFields: [
      { key: "icon", label: "React Icon Name", type: "string", required: true },
      { key: "stat", label: "Stat Value (e.g. 120+)", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "about-values": {
    title: "About Page — Values",
    description: "Value cards on the About page.",
    table: "about_values",
    single: false,
    translatableFields: [
      { key: "title", label: "Value Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "icon", label: "React Icon Name", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "packages": {
    title: "Service Packages",
    description: "Pricing packages shown on the homepage.",
    table: "service_packages",
    single: false,
    translatableFields: [
      { key: "name", label: "Package Name", type: "text", required: true },
      { key: "price", label: "Price Display", type: "text", required: true },
      { key: "period", label: "Period (e.g. /project)", type: "text" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "features", label: "Features", type: "array" },
      { key: "cta_text", label: "CTA Text", type: "text" },
    ],
    plainFields: [
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_popular", label: "Most Popular?", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "testimonials": {
    title: "Testimonials",
    description: "Client testimonials displayed across the site.",
    table: "testimonials",
    single: false,
    translatableFields: [
      { key: "role", label: "Role / Company", type: "text", required: true },
      { key: "text", label: "Testimonial Text", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "name", label: "Full Name", type: "string", required: true, plain: true },
      { key: "initials", label: "Initials (2 chars)", type: "string", required: true },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "faq": {
    title: "FAQ Entries",
    description: "Frequently asked questions.",
    table: "faq_entries",
    single: false,
    translatableFields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "category", label: "Category (e.g. general)", type: "string" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "projects": {
    title: "Portfolio / Projects",
    description: "Case studies and portfolio projects.",
    table: "projects",
    single: false,
    translatableFields: [
      { key: "title", label: "Project Title", type: "text", required: true },
      { key: "description", label: "Short Description", type: "textarea", required: true },
      { key: "tags", label: "Tags", type: "array" },
      { key: "challenge", label: "Challenge", type: "richtext" },
      { key: "solution", label: "Solution", type: "richtext" },
      { key: "results", label: "Results", type: "array" },
      { key: "short_label", label: "Metric Label", type: "text" },
      { key: "services", label: "Services Delivered", type: "array" },
    ],
    plainFields: [
      { key: "category", label: "Category", type: "string", required: true },
      { key: "image", label: "Cover Image URL", type: "string" },
      { key: "short_metric", label: "Short Metric (e.g. +69%)", type: "string" },
      { key: "client", label: "Client Name", type: "string" },
      { key: "industry", label: "Industry", type: "string" },
      { key: "timeline", label: "Timeline", type: "string" },
      { key: "gallery", label: "Gallery URLs (JSON array)", type: "json-array" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "insights": {
    title: "Insights / Blog",
    description: "Blog posts and thought leadership articles.",
    table: "insights",
    single: false,
    translatableFields: [
      { key: "title", label: "Article Title", type: "text", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { key: "content", label: "Content (paragraphs)", type: "array" },
    ],
    plainFields: [
      { key: "slug", label: "URL Slug", type: "string", required: true },
      { key: "category", label: "Category", type: "string", required: true },
      { key: "image", label: "Cover Image URL", type: "string" },
      { key: "read_time", label: "Read Time (e.g. 5 min read)", type: "string" },
      { key: "date", label: "Date (e.g. Jun 28, 2026)", type: "string" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  "buy-business-niches": {
    title: "Buy Business — Niches",
    description: "Business niche categories.",
    table: "buy_business_niches",
    single: false,
    translatableFields: [
      { key: "title", label: "Niche Title", type: "text", required: true },
      { key: "description", label: "Short Description", type: "textarea", required: true },
      { key: "hero_description", label: "Hero Description", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "slug", label: "URL Slug", type: "string", required: true },
      { key: "image", label: "Hero Image URL", type: "string" },
      { key: "icon", label: "Emoji Icon", type: "string" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "buy-business-brands": {
    title: "Buy Business — Brands",
    description: "Individual business listings within niches.",
    table: "buy_business_brands",
    single: false,
    translatableFields: [
      { key: "description", label: "Brand Description", type: "textarea", required: true },
      { key: "tags", label: "Tags", type: "array" },
      { key: "highlights", label: "Highlights", type: "array" },
    ],
    plainFields: [
      { key: "niche_id", label: "Niche ID (UUID)", type: "string", required: true },
      { key: "slug", label: "URL Slug", type: "string", required: true },
      { key: "name", label: "Brand Name", type: "string", required: true },
      { key: "price", label: "Price", type: "string" },
      { key: "revenue", label: "Revenue", type: "string" },
      { key: "profit", label: "Profit", type: "string" },
      { key: "image", label: "Image URL", type: "string" },
      { key: "website_url", label: "Website URL", type: "string" },
      { key: "logo", label: "Logo/Emoji", type: "string" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  "legal-pages": {
    title: "Legal Pages",
    description: "Privacy Policy, Terms & Conditions, Cookie Policy.",
    table: "legal_pages",
    single: false,
    translatableFields: [
      { key: "title", label: "Page Title", type: "text", required: true },
      { key: "content", label: "Page Content", type: "richtext", required: true },
    ],
    plainFields: [
      { key: "slug", label: "URL Slug", type: "string", required: true },
    ],
  },
  "contact-form": {
    title: "Contact Form Config",
    description: "Contact form headings, success message, and dropdown options.",
    table: "contact_form_config",
    single: true,
    translatableFields: [
      { key: "heading", label: "Form Heading", type: "text" },
      { key: "subheading", label: "Form Subheading", type: "text" },
      { key: "success_title", label: "Success Title", type: "text" },
      { key: "success_message", label: "Success Message", type: "textarea" },
      { key: "services_list", label: "Services List", type: "array" },
    ],
    plainFields: [
      { key: "budget_ranges", label: "Budget Ranges (JSON)", type: "json-array" },
    ],
  },
  "service-pages": {
    title: "Service Pages (Brand/Website/AI/Growth)",
    description:
      "Hero + sections for the 4 service pages. Identified by `slug`: brand-design, website-development, ai-automation, growth-marketing.",
    table: "service_page_content",
    single: false,
    translatableFields: [
      { key: "hero_title", label: "Hero Title", type: "text", required: true },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea", required: true },
      { key: "sections", label: "Sections (JSON array of {title, content, bullet_points, image_url})", type: "json-array" },
    ],
    plainFields: [
      { key: "slug", label: "Slug (brand-design | website-development | ai-automation | growth-marketing)", type: "string", required: true },
    ],
  },
  "niche-stats": {
    title: "Buy Business — Niche Stats",
    description:
      "Per-niche stat cards shown on the niche landing page (e.g. Avg. Revenue, Avg. Margin). Fill `niche_id` with the niche's UUID from the Niches editor.",
    table: "niche_stats",
    single: false,
    translatableFields: [
      { key: "label", label: "Stat Label", type: "text", required: true },
      { key: "sub", label: "Stat Sub-line", type: "text" },
    ],
    plainFields: [
      { key: "niche_id", label: "Niche UUID", type: "string", required: true },
      { key: "stat", label: "Stat Value (e.g. $85K)", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "niche-inclusions": {
    title: "Buy Business — Niche Inclusions",
    description:
      "Per-niche 'What's Included' bullets shown on the niche landing page.",
    table: "niche_inclusions",
    single: false,
    translatableFields: [
      { key: "text", label: "Inclusion Text", type: "textarea", required: true },
    ],
    plainFields: [
      { key: "niche_id", label: "Niche UUID", type: "string", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  "section-labels": {
    title: "Section Labels & Headings",
    description: "Global section headings and subtitles used across all pages.",
    table: "section_labels",
    single: true,
    translatableFields: [
      { key: "services_label", label: "Services - Section Label", type: "text" },
      { key: "services_title_prefix", label: "Services - Title Prefix", type: "text" },
      { key: "services_title_highlight", label: "Services - Highlight Word", type: "text" },
      { key: "services_subtitle", label: "Services - Subtitle", type: "textarea" },
      { key: "process_label", label: "Process - Section Label", type: "text" },
      { key: "process_title_prefix", label: "Process - Title Prefix", type: "text" },
      { key: "process_title_highlight", label: "Process - Highlight Word", type: "text" },
      { key: "process_subtitle", label: "Process - Subtitle", type: "textarea" },
      { key: "pricing_label", label: "Pricing - Section Label", type: "text" },
      { key: "pricing_title_prefix", label: "Pricing - Title Prefix", type: "text" },
      { key: "pricing_title_highlight", label: "Pricing - Highlight Word", type: "text" },
      { key: "pricing_subtitle", label: "Pricing - Subtitle", type: "textarea" },
      { key: "portfolio_label", label: "Portfolio - Section Label", type: "text" },
      { key: "portfolio_title_prefix", label: "Portfolio - Title Prefix", type: "text" },
      { key: "portfolio_title_highlight", label: "Portfolio - Highlight Word", type: "text" },
      { key: "portfolio_subtitle", label: "Portfolio - Subtitle", type: "textarea" },
      { key: "testimonials_label", label: "Testimonials - Section Label", type: "text" },
      { key: "testimonials_title_prefix", label: "Testimonials - Title Prefix", type: "text" },
      { key: "testimonials_title_highlight", label: "Testimonials - Highlight Word", type: "text" },
      { key: "testimonials_subtitle", label: "Testimonials - Subtitle", type: "textarea" },
      { key: "insights_label", label: "Insights - Section Label", type: "text" },
      { key: "insights_title_prefix", label: "Insights - Title Prefix", type: "text" },
      { key: "insights_title_highlight", label: "Insights - Highlight Word", type: "text" },
      { key: "insights_subtitle", label: "Insights - Subtitle", type: "textarea" },
      { key: "faq_label", label: "FAQ - Section Label", type: "text" },
      { key: "faq_title_prefix", label: "FAQ - Title Prefix", type: "text" },
      { key: "faq_title_highlight", label: "FAQ - Highlight Word", type: "text" },
      { key: "faq_subtitle", label: "FAQ - Subtitle", type: "textarea" },
      { key: "contact_label", label: "Contact - Section Label", type: "text" },
      { key: "contact_title_prefix", label: "Contact - Title Prefix", type: "text" },
      { key: "contact_title_highlight", label: "Contact - Highlight Word", type: "text" },
      { key: "contact_subtitle", label: "Contact - Subtitle", type: "textarea" },
    ],
    plainFields: [],
  },
};
