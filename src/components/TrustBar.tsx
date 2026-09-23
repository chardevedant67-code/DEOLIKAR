"use client";

import { HeartHandshake, MessagesSquare, ShieldCheck, Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "./ui/Reveal";

/** Credibility strip overlapping the bottom of the hero. Only supplied facts — no invented credentials. */
export function TrustBar() {
  const { t } = useLanguage();

  const items = [
    { icon: ShieldCheck, title: t.trust.amfi, detail: t.trust.arn, lead: true },
    { icon: MessagesSquare, title: t.trust.freeConsult },
    { icon: Target, title: t.trust.goalOriented },
    { icon: HeartHandshake, title: t.trust.personalised },
  ];

  return (
    <section aria-label={t.trust.ariaLabel} className="relative z-10 -mt-12 pb-6 sm:-mt-14 lg:-mt-16">
      <div className="container-page">
        <Reveal variant="up">
          <ul className="glass grid grid-cols-3 overflow-hidden rounded-[1.75rem] shadow-lift md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {items.map(({ icon: Icon, title, detail, lead }, i) => (
              <li
                key={title}
                className={`flex gap-3 border-mist-200 p-4 sm:p-5 lg:px-7 lg:py-6 ${
                  lead
                    ? "col-span-3 items-center border-b md:col-span-1 md:border-b-0"
                    : "flex-col items-center text-center md:flex-row md:text-left"
                } ${i > 1 ? "border-l md:border-l" : ""} ${i === 1 ? "md:border-l" : ""}`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-2xl ${
                    lead ? "h-12 w-12 bg-navy-950 text-white" : "h-11 w-11 bg-royal-50 text-royal-600"
                  }`}
                >
                  <Icon size={lead ? 22 : 20} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={`block font-semibold leading-snug text-navy-950 ${lead ? "text-[15px]" : "text-[13px] sm:text-sm"}`}>
                    {title}
                  </span>
                  {detail ? (
                    <span className="tabular mt-1 inline-block rounded-md bg-royal-50 px-2 py-0.5 text-[13px] font-bold tracking-wide text-royal-700">
                      {detail}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
