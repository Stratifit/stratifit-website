export interface Testimonial {
  name: string;
  role: string;
  initials: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "James Dalton",
    role: "CEO, Luxe Retail",
    initials: "JD",
    rating: 5,
    text: "Stratifit transformed our digital presence. Their strategic approach and luxury design language elevated our brand to a completely new level.",
  },
  {
    name: "Elena Silva",
    role: "CTO, AeroFlow",
    initials: "ES",
    rating: 5,
    text: "The automation solutions provided by the team saved us countless hours. Efficient, scalable, and beautifully executed.",
  },
  {
    name: "Marcus Chen",
    role: "Director, Zenith Bank",
    initials: "MC",
    rating: 5,
    text: "A partner that truly understands the intersection of technology and premium aesthetics. The results speak for themselves.",
  },
  {
    name: "Sarah Okonkwo",
    role: "Founder, Aura Cosmetics",
    initials: "SO",
    rating: 5,
    text: "From brand identity to e-commerce, Stratifit delivered beyond expectations. Our conversion rate tripled in 90 days.",
  },
  {
    name: "David Park",
    role: "VP Marketing, Nova Fintech",
    initials: "DP",
    rating: 5,
    text: "The growth engine they built for us is a revenue machine. Predictable, measurable, and scalable.",
  },
  {
    name: "Amara Obi",
    role: "Creative Director, Atlas Media",
    initials: "AO",
    rating: 5,
    text: "Working with Stratifit feels like an extension of our team. Their design sensibility is unmatched in the industry.",
  },
];
