"use client";

import { ArrowRight, Check } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/planner-context";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { Reveal } from "./ui/Reveal";
import { btnLight, btnOutlineLight } from "./ui/buttons";

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section id="start" aria-labelledby="start-heading" className="relative bg-white pb-8 pt-4 sm:pb-12 lg:pb-16">
      <div className="container-page">
        <Reveal variant="scale">
          <div className="on-dark relative isolate overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-navy-950 via-navy-900 to-[#0a3273] px-6 py-14 text-white shadow-[0_40px_80px_-40px_rgba(1,20,52,0.8)] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div aria-hidden className="bg-hairline-grid-dark absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_90%_at_80%_50%,#000,transparent_70%)]" />
            <div aria-hidden className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-royal-500/35 blur-[100px]" />

            {/* decorative growth line */}
            <svg
              aria-hidden
              viewBox="-10 -10 540 340"
              fill="none"
              className="absolute -bottom-4 right-0 -z-10 hidden h-[88%] w-[52%] text-royal-300/40 lg:block"
            >
              <path d="M0 300C90 296 140 260 200 226S300 170 350 120S450 50 520 20" stroke="currentColor" strokeWidth="2" />
              <path d="M0 300C90 296 140 260 200 226S300 170 350 120S450 50 520 20V320H0Z" fill="url(#cta-fill)" />
              <circle cx="200" cy="226" r="6" fill="#011434" stroke="currentColor" strokeWidth="2" />
              <circle cx="350" cy="120" r="6" fill="#011434" stroke="currentColor" strokeWidth="2" />
              <circle cx="520" cy="20" r="7" fill="#47cf98" />
              <defs>
                <linearGradient id="cta-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#5b93ee" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#5b93ee" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-mint-400/40 bg-mint-400/10 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-mint-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-400 text-navy-950">
                  <Check size={14} strokeWidth={3} aria-hidden />
                </span>
                {t.cta.freeConsult}
              </p>
              <h2 id="start-heading" className="display mt-6 text-[clamp(2.1rem,1.3rem+3.4vw,3.7rem)]">
                {t.cta.heading}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/75 sm:text-lg">{t.cta.text}</p>
              <p className="mt-6 border-l-2 border-mint-400 pl-4 font-display text-lg font-bold leading-snug tracking-tight text-white sm:text-xl">
                {t.cta.sipLine}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => scrollToSection("contact")} className={btnLight}>
                  {t.cta.primary}
                  <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <a
                  href={buildWhatsAppLink(t.floating.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnOutlineLight}
                >
                  <WhatsAppIcon size={18} />
                  {t.cta.secondary}
                  <span className="sr-only">{t.a11y.opensInNewTab}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
