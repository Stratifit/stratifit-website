export interface StaticFaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const staticFaq: StaticFaqEntry[] = [
  { id: 'timeline-project', question: 'What is the typical timeline for a branding project?', answer: 'A standard branding project spans 4-6 weeks from discovery to final delivery. Timelines are tailored to scope - brand strategy and identity rollouts may extend to 8 weeks.' },
  { id: 'post-launch-support', question: 'Do you offer post-launch support?', answer: 'Yes. Every engagement includes 30 days of complimentary post-launch support with priority email access and performance reports.' },
  { id: 'payment-structure', question: 'How are payments structured?', answer: '50% deposit to commence work, 50% on completion. Milestone billing available for enterprise-scale projects $10K+.' },
  { id: 'tech-stack', question: 'What technology stack do you use?', answer: 'Our core stack includes Next.js, React, TypeScript, Tailwind CSS, and Node.js. CMS picks (Sanity, Contentful, Strapi) are project-specific.' },
  { id: 'existing-systems', question: 'Can you work with our existing systems and tools?', answer: 'Absolutely. We integrate natively with HubSpot, Salesforce, Stripe, custom APIs, and your existing infrastructure.' },
  { id: 'post-launch-marketing', question: 'Do you handle ongoing marketing after launch?', answer: 'Our Growth Engine service includes performance marketing, analytics tracking, conversion optimization, and funnel management.' },
  { id: 'ai-approach', question: 'What is your approach to AI and automation?', answer: 'We build production-grade AI solutions measured against real business outcomes - chatbots, lead qual, workflow automation.' },
  { id: 'kpi-success', question: 'How do you measure success?', answer: 'Every engagement begins with KPIs tied to your business objectives, shared via live dashboards with full transparency.' },
];

export function nextStaticFaqId(existing: StaticFaqEntry[]): string {
  let i = existing.length + 1;
  while (existing.some((e) => e.id === 'faq-' + i)) i++;
  return 'faq-' + i;
}
