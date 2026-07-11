import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MarketingChromeTop, MarketingChromeBottom } from "@/components/layout/MarketingChrome";
import { DesktopChatbot } from "@/components/chat/DesktopChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stratifit | Premium Digital Agency — Brand, Web, AI & Growth",
  description:
    "Stratifit builds premium digital strategies that scale. From branding to AI automation and growth marketing, we help ambitious brands dominate their markets.",
  keywords: [
    "digital agency",
    "branding",
    "web development",
    "AI automation",
    "growth marketing",
    "Stratifit",
  ],
  openGraph: {
    title: "Stratifit | Premium Digital Agency",
    description: "Brand, web, AI, and growth — engineered for scale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* Set body.admin-active for /admin/* paths BEFORE any other body content
             paints, so the marketing-chrome CSS hide rule suppresses the SSR
             flash of Header / Footer / CookiePopup / ContactModal / DesktopChatbot. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){if(location.pathname&&location.pathname.indexOf('/admin')===0){document.body.classList.add('admin-active');}})();",
          }}
        />
        <SmoothScroll>
          {/* Above-main: fixed-positioned header (DOM order doesn't affect its visual pinning). */}
          <MarketingChromeTop />
          <main className="flex-1">{children}</main>
          {/* Below-main: footer + cookie banner + contact modal (DOM order makes them render after page content). */}
          <MarketingChromeBottom />
        </SmoothScroll>
        {/* Desktop floating chat — outside SmoothScroll so positioning is correct.
            Self-gates via pathname check inside DesktopChatbot.tsx so it never
            shows on /admin/* paths. */}
        <DesktopChatbot />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var DURATION = 1800;
  var STAGGER = 400;
  var started = new Set();
  var delayedTimers = [];
  var observer = null;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateEl(el, delay) {
    if (started.has(el)) return;
    started.add(el);
    if (observer) observer.unobserve(el);
    if (delay && delay > 0) {
      var t = setTimeout(function() { runAnim(el); }, delay);
      delayedTimers.push(t);
    } else {
      runAnim(el);
    }
  }

  function runAnim(el) {
    var target = parseInt(el.getAttribute('data-target') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) { el.textContent = suffix; return; }

    var startTime = null;
    function step(ts) {
      if (startTime === null) startTime = ts;
      var progress = Math.min((ts - startTime) / DURATION, 1);
      var eased = easeOutExpo(progress);
      el.textContent = String(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(target) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function getSortedEls() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-target]'));
    els.sort(function(a, b) {
      return parseInt(a.getAttribute('data-target') || '0', 10) - parseInt(b.getAttribute('data-target') || '0', 10);
    });
    return els;
  }

  function isAnyInView() {
    var els = document.querySelectorAll('[data-target]');
    for (var i = 0; i < els.length; i++) {
      if (isInView(els[i])) return true;
    }
    return false;
  }

  function isInView(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < (window.innerHeight + 200) && rect.bottom > -200;
  }

  function triggerBatch() {
    var els = getSortedEls();
    var anyInView = false;
    for (var i = 0; i < els.length; i++) {
      if (isInView(els[i])) { anyInView = true; break; }
    }
    if (!anyInView) return;

    els.forEach(function(el, idx) {
      if (!started.has(el)) {
        animateEl(el, idx * STAGGER);
      }
    });
  }

  function init() {
    var els = document.querySelectorAll('[data-target]');
    if (els.length === 0) return;

    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) triggerBatch();
      });
    }, { rootMargin: '200px 0px', threshold: 0 });

    els.forEach(function(el) { observer.observe(el); });

    setTimeout(triggerBatch, 100);
    setTimeout(triggerBatch, 500);
    setTimeout(triggerBatch, 1500);
    setTimeout(triggerBatch, 3000);

    var scrollTimer = null;
    window.addEventListener('scroll', function() {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(triggerBatch, 100);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`,
          }}
        />
      </body>
    </html>
  );
}
