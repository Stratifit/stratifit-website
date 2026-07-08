import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-glow rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="relative z-10 text-center max-w-lg">
        <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">404</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-tight tracking-tight mb-4">
          Page Not <span className="text-amber">Found</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 border-l-2 border-amber/50 pl-4 sm:pl-6 mx-auto max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-black font-bold text-sm px-6 py-3 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <HiArrowLeft className="text-lg" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
