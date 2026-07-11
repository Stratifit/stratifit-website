"use client";

import { usePathname } from "next/navigation";
import { AIChatbot } from "@/components/chat/AIChatbot";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";

export function DesktopChatbot() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <div
      className="hidden lg:flex items-center gap-3 fixed bottom-6 right-6 z-40 bg-card-dark rounded-full pl-4 pr-2 py-2 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      data-chat-trigger=""
      data-marketing-chrome="true"
    >
      <span className="text-white text-xs font-medium whitespace-nowrap">
        <HiChatBubbleLeftRight className="inline text-amber text-sm mr-1.5" />
        {tLabel("chatbot_d_trigger", lang)}
      </span>
      <AIChatbot />
    </div>
  );
}
