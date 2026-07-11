/* ------------------------------------------------------------------ */
/*  Language & Translation Types                                      */
/* ------------------------------------------------------------------ */

export type Language = "en" | "de" | "fr" | "es";

export const ALL_LANGUAGES: Language[] = ["en", "de", "fr", "es"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: "gb",
  de: "de",
  fr: "fr",
  es: "es",
};

/** A translatable string: keyed by language code. */
export type TranslatableString = Record<Language, string>;

/** A translatable array of strings. */
export type TranslatableArray = Record<Language, string[]>;

/** Create an empty translatable string (all languages empty). */
export function emptyTranslatableString(): TranslatableString {
  return { en: "", de: "", fr: "", es: "" };
}

/** Create an empty translatable array. */
export function emptyTranslatableArray(): TranslatableArray {
  return { en: [], de: [], fr: [], es: [] };
}

/** Get a translated value, falling back to English. */
export function t(value: TranslatableString | undefined | null, lang: Language): string {
  if (!value) return "";
  return value[lang] || value["en"] || "";
}

/** Get a translated array. */
export function ta(value: TranslatableArray | undefined | null, lang: Language): string[] {
  if (!value) return [];
  return value[lang] || value["en"] || [];
}

/* ------------------------------------------------------------------ */
/*  Site Settings                                                     */
/* ------------------------------------------------------------------ */

export interface SiteSettings {
  id: string;
  site_name: TranslatableString;
  site_tagline: TranslatableString;
  logo_text: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Header Navigation                                                 */
/* ------------------------------------------------------------------ */

export interface HeaderNavLink {
  id: string;
  sort_order: number;
  label: TranslatableString;
  href: string;
  action: string | null; // "contact" for contact modal trigger
  is_cta: boolean;
  cta_text: TranslatableString;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */

export interface FooterColumn {
  title: TranslatableString;
  links: { label: TranslatableString; href: string; action: string | null }[];
}

export interface FooterContent {
  id: string;
  tagline: TranslatableString;
  columns: FooterColumn[];
  social_links: { platform: string; url: string; label: TranslatableString }[];
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                      */
/* ------------------------------------------------------------------ */

export interface HeroContent {
  id: string;
  badge_text: TranslatableString;
  heading_line1: TranslatableString;
  heading_line2: TranslatableString;
  subheading: TranslatableString;
  cta_primary: TranslatableString;
  cta_secondary: TranslatableString;
  trusted_by_label: TranslatableString;
  trusted_companies: { name: string }[];
  stats: { target: string; suffix: string; label_line1: TranslatableString; label_line2: TranslatableString }[];
  tech_stack_label_prefix: TranslatableString;
  tech_stack_highlight: TranslatableString;
  tech_stack_label_suffix: TranslatableString;
  tech_stack_subtitle: TranslatableString;
  tech_stack_items: { name: string; color: string }[];
}

/* ------------------------------------------------------------------ */
/*  Core Services                                                     */
/* ------------------------------------------------------------------ */

export interface CoreService {
  id: string;
  sort_order: number;
  icon: string;
  title: TranslatableString;
  description: TranslatableString;
  deliverables: TranslatableArray;
  href: string;
  cta_text: TranslatableString;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Service Pages (Brand Design, Website Dev, AI Auto, Growth Mktg)  */
/* ------------------------------------------------------------------ */

export interface ServicePageContent {
  id: string;
  slug: string; // "brand-design", "website-development", "ai-automation", "growth-marketing"
  hero_title: TranslatableString;
  hero_subtitle: TranslatableString;
  sections: ServicePageSection[];
}

export interface ServicePageSection {
  id: string;
  sort_order: number;
  title: TranslatableString;
  content: TranslatableString;
  bullet_points: TranslatableArray;
  image_url: string;
}

/* ------------------------------------------------------------------ */
/*  Process Steps                                                     */
/* ------------------------------------------------------------------ */

export interface ProcessStep {
  id: string;
  step_number: number;
  icon: string;
  title: TranslatableString;
  description: TranslatableString;
}

/* ------------------------------------------------------------------ */
/*  Why Choose Us                                                     */
/* ------------------------------------------------------------------ */

export interface WhyChooseUsContent {
  id: string;
  section_label: TranslatableString;
  section_title_prefix: TranslatableString;
  section_title_highlight: TranslatableString;
  section_title_suffix: TranslatableString;
  section_subtitle: TranslatableString;
}

export interface WhyChooseUsBenefit {
  id: string;
  sort_order: number;
  icon: string;
  title: TranslatableString;
  description: TranslatableString;
  stat: TranslatableString;
  stat_label: TranslatableString;
}

/* ------------------------------------------------------------------ */
/*  About Page                                                        */
/* ------------------------------------------------------------------ */

export interface AboutPageContent {
  id: string;
  hero_title_prefix: TranslatableString;
  hero_title_highlight: TranslatableString;
  hero_subtitle: TranslatableString;
  mission_text: TranslatableString;
  story_text: TranslatableString;
  team_text: TranslatableString;
  cta_title_prefix: TranslatableString;
  cta_title_highlight: TranslatableString;
  cta_subtitle: TranslatableString;
  cta_button_text: TranslatableString;
}

export interface AboutStat {
  id: string;
  sort_order: number;
  icon: string;
  stat: string;
  label: TranslatableString;
}

export interface AboutValue {
  id: string;
  sort_order: number;
  icon: string;
  title: TranslatableString;
  description: TranslatableString;
}

/* ------------------------------------------------------------------ */
/*  Packages                                                          */
/* ------------------------------------------------------------------ */

export interface ServicePackage {
  id: string;
  sort_order: number;
  name: TranslatableString;
  price: TranslatableString;
  period: TranslatableString;
  description: TranslatableString;
  features: TranslatableArray;
  cta_text: TranslatableString;
  is_popular: boolean;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                      */
/* ------------------------------------------------------------------ */

export interface TestimonialItem {
  id: string;
  sort_order: number;
  name: string;
  role: TranslatableString;
  initials: string;
  rating: number;
  text: TranslatableString;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

export interface FaqEntry {
  id: string;
  sort_order: number;
  category: string;
  question: TranslatableString;
  answer: TranslatableString;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Portfolio / Projects                                              */
/* ------------------------------------------------------------------ */

export interface ProjectItem {
  id: string;
  sort_order: number;
  title: TranslatableString;
  category: string;
  description: TranslatableString;
  image: string;
  tags: TranslatableArray;
  challenge: TranslatableString;
  solution: TranslatableString;
  results: TranslatableArray;
  short_metric: string;
  short_label: TranslatableString;
  client: string;
  industry: string;
  timeline: string;
  services: TranslatableArray;
  gallery: string[];
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Insights / Blog                                                   */
/* ------------------------------------------------------------------ */

export interface InsightItem {
  id: string;
  sort_order: number;
  slug: string;
  category: string;
  title: TranslatableString;
  excerpt: TranslatableString;
  image: string;
  read_time: string;
  date: string;
  content: TranslatableArray;
  is_published: boolean;
}

/* ------------------------------------------------------------------ */
/*  Buy Business — Niches & Brands                                    */
/* ------------------------------------------------------------------ */

export interface BuyBusinessNiche {
  id: string;
  sort_order: number;
  slug: string;
  title: TranslatableString;
  description: TranslatableString;
  hero_description: TranslatableString;
  image: string;
  icon: string;
  is_active: boolean;
}

export interface NicheStat {
  id: string;
  niche_id: string;
  sort_order: number;
  stat: string;
  label: TranslatableString;
  sub: TranslatableString;
}

export interface NicheInclusion {
  id: string;
  niche_id: string;
  sort_order: number;
  text: TranslatableString;
}

export interface BuyBusinessBrand {
  id: string;
  niche_id: string;
  sort_order: number;
  slug: string;
  name: string;
  price: string;
  revenue: string;
  profit: string;
  description: TranslatableString;
  image: string;
  website_url: string;
  logo: string;
  tags: TranslatableArray;
  highlights: TranslatableArray;
  is_active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Legal Pages                                                       */
/* ------------------------------------------------------------------ */

export interface LegalPage {
  id: string;
  slug: string; // "privacy-policy", "terms-conditions", "cookie-policy"
  title: TranslatableString;
  content: TranslatableString; // HTML or markdown content
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Contact Form Config                                               */
/* ------------------------------------------------------------------ */

export interface ContactFormConfig {
  id: string;
  heading: TranslatableString;
  subheading: TranslatableString;
  success_title: TranslatableString;
  success_message: TranslatableString;
  services_list: TranslatableArray;
  budget_ranges: { label: TranslatableString; value: string }[];
}

/* ------------------------------------------------------------------ */
/*  Section Label Overrides (global section metadata)                  */
/* ------------------------------------------------------------------ */

export interface SectionLabels {
  id: string;
  services_label: TranslatableString;
  services_title_prefix: TranslatableString;
  services_title_highlight: TranslatableString;
  services_subtitle: TranslatableString;
  process_label: TranslatableString;
  process_title_prefix: TranslatableString;
  process_title_highlight: TranslatableString;
  process_subtitle: TranslatableString;
  pricing_label: TranslatableString;
  pricing_title_prefix: TranslatableString;
  pricing_title_highlight: TranslatableString;
  pricing_subtitle: TranslatableString;
  portfolio_label: TranslatableString;
  portfolio_title_prefix: TranslatableString;
  portfolio_title_highlight: TranslatableString;
  portfolio_subtitle: TranslatableString;
  testimonials_label: TranslatableString;
  testimonials_title_prefix: TranslatableString;
  testimonials_title_highlight: TranslatableString;
  testimonials_subtitle: TranslatableString;
  insights_label: TranslatableString;
  insights_title_prefix: TranslatableString;
  insights_title_highlight: TranslatableString;
  insights_subtitle: TranslatableString;
  faq_label: TranslatableString;
  faq_title_prefix: TranslatableString;
  faq_title_highlight: TranslatableString;
  faq_subtitle: TranslatableString;
  contact_label: TranslatableString;
  contact_title_prefix: TranslatableString;
  contact_title_highlight: TranslatableString;
  contact_subtitle: TranslatableString;
}

/* ------------------------------------------------------------------ */
/*  Aggregated CMS Content (for the website to consume)               */
/* ------------------------------------------------------------------ */

export interface CmsContent {
  site_settings: SiteSettings | null;
  header_nav: HeaderNavLink[];
  footer: FooterContent | null;
  hero: HeroContent | null;
  services: CoreService[];
  process_steps: ProcessStep[];
  why_choose_us_content: WhyChooseUsContent | null;
  why_choose_us_benefits: WhyChooseUsBenefit[];
  about_page: AboutPageContent | null;
  about_stats: AboutStat[];
  about_values: AboutValue[];
  packages: ServicePackage[];
  testimonials: TestimonialItem[];
  faq_entries: FaqEntry[];
  projects: ProjectItem[];
  insights: InsightItem[];
  niches: BuyBusinessNiche[];
  brands: BuyBusinessBrand[];
  legal_pages: LegalPage[];
  contact_form: ContactFormConfig | null;
  section_labels: SectionLabels | null;
}
