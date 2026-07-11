"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookiePopup } from "./CookiePopup";
import { ContactModal } from "@/components/contact/ContactModal";

/* ------------------------------------------------------------------ */
/*  Marketing chrome helpers                                          */
/*                                                                   */
/*  Split so the public-site footer / cookie banner / contact modal   */
/*  render AFTER the page main content (correct DOM order for a       */
/*  flex-col body layout), while the fixed-positioned header can      */
/*  still render BEFORE main in document order without affecting      */
/*  its visual placement. Both wrappers return `null` on /admin/*    */
/*  paths so admin pages render nothing and the dedicated             */
/*  /admin top bar (logo + profile) takes over.                       */
/* ------------------------------------------------------------------ */

function useIsPublicSite(): boolean {
  const pathname = usePathname();
  return !pathname?.startsWith("/admin");
}

/** Header (fixed-positioned) — renders ABOVE the page main. */
export function MarketingChromeTop() {
  const isPublic = useIsPublicSite();
  if (!isPublic) return null;
  return <Header />;
}

/** Footer + cookie banner + contact modal — render BELOW the page main. */
export function MarketingChromeBottom() {
  const isPublic = useIsPublicSite();
  if (!isPublic) return null;
  return (
    <>
      <Footer />
      <CookiePopup />
      <ContactModal />
    </>
  );
}
