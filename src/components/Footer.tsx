"use client";

import { ArrowUp, Globe, Mail, Phone } from "lucide-react";
import { CONTACT, MAILTO_HREF, TEL_HREF } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { scrollToSection, usePlanner } from "@/lib/planner-context";
import { NAV_ITEMS } from "@/lib/sections";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLanguage();
  const { setServiceIndex } = usePlanner();
  const f = t.footer;

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    scrollToSection(id);
  };

  const linkClass = "inline-flex min-h-8 items-center text-[15px] text-white/70 transition-colors hover:text-white";

  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 pb-28 pt-16 text-white md:pb-10 lg:pt-20">
      <div aria-hidden className="bg-hairline-grid-dark pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-royal-500/15 blur-[100px]" />

      <div className="container-page relative">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="w-48 sm:w-56" sizes="240px" />
            <p className="mt-6 font-display text-[15px] font-bold leading-snug tracking-tight">{t.contact.companyName}</p>
            <p className="mt-1.5 text-[15px] text-white/65">{f.tagline}</p>
          </div>

          <nav aria-labelledby="footer-quick" className="lg:col-span-2 lg:col-start-6">
            <h2 id="footer-quick" className="tracking-caps text-[11px] font-bold text-royal-300">
              {f.quickLinksHeading}
            </h2>
            <ul className="mt-4 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a href={item.href} onClick={go(item.href.slice(1))} className={linkClass}>
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services" className="lg:col-span-2">
            <h2 id="footer-services" className="tracking-caps text-[11px] font-bold text-royal-300">
              {f.servicesHeading}
            </h2>
            <ul className="mt-4 space-y-1.5">
              {t.services.items.map((service, i) => (
                <li key={service.key}>
                  <a
                    href="#services"
                    onClick={(event) => {
                      event.preventDefault();
                      setServiceIndex(i);
                    }}
                    className={linkClass}
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="tracking-caps text-[11px] font-bold text-royal-300">{f.contactHeading}</h2>
            <ul className="mt-4 space-y-3.5">
              <li>
                <a href={TEL_HREF} className="group flex items-center gap-3 text-[15px] text-white/80 transition-colors hover:text-white">
                  <Phone size={16} className="text-royal-300" aria-hidden />
                  <span className="tabular">{CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={MAILTO_HREF} className="group flex items-start gap-3 text-[15px] text-white/80 transition-colors hover:text-white">
                  <Mail size={16} className="mt-1 shrink-0 text-royal-300" aria-hidden />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://${CONTACT.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[15px] text-white/80 transition-colors hover:text-white"
                >
                  <Globe size={16} className="text-royal-300" aria-hidden />
                  {CONTACT.website}
                  <span className="sr-only">{t.a11y.opensInNewTab}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
              <span>{f.amfi}</span>
              <span aria-hidden className="hidden h-3.5 w-px bg-white/25 sm:block" />
              <span className="tabular font-bold text-white">{f.arn}</span>
            </p>
            <a
              href="#disclaimer"
              onClick={go("disclaimer")}
              className="inline-flex min-h-8 items-center text-sm font-medium text-royal-200 underline decoration-royal-300/40 underline-offset-4 transition-colors hover:text-white"
            >
              {f.disclaimerLink}
            </a>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-relaxed text-white/50">{f.rights}</p>
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="group inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-white/20 px-4 text-[13px] font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white sm:self-auto"
            >
              {f.backToTop}
              <ArrowUp size={15} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
