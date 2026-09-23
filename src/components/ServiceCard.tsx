"use client";

import { ArrowRight } from "lucide-react";
import type { ServiceItem } from "@/lib/i18n/dictionary";
import { ServiceIcon } from "./icons/ServiceIcons";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  learnMore: string;
  onOpen: (index: number) => void;
}

/**
 * A single service. The whole card is clickable via a stretched "Learn More"
 * button (so heading and description stay real, readable text for assistive tech).
 */
export function ServiceCard({ service, index, learnMore, onOpen }: ServiceCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-1.5 hover:border-royal-300 hover:shadow-lift has-[:focus-visible]:border-royal-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-royal-500/40 sm:p-7">
      {/* soft background transition on hover */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-royal-50/0 to-royal-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-50 text-navy-900 transition duration-300 [--icon-accent-soft:rgba(47,111,228,0.16)] [--icon-accent:#2f6fe4] [--icon-badge-bg:#f0f5fe] group-hover:-translate-y-0.5 group-hover:bg-navy-950 group-hover:text-white group-hover:[--icon-accent-soft:rgba(71,207,152,0.2)] group-hover:[--icon-accent:#47cf98] group-hover:[--icon-badge-bg:#011434]">
          <ServiceIcon service={service.key} className="h-8 w-8 transition-transform duration-500 group-hover:scale-105" />
        </span>
        <span
          aria-hidden
          className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-mist-200 transition-colors duration-300 tabular group-hover:text-royal-200"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-[1.3rem] font-bold tracking-tight text-navy-950">{service.title}</h3>
      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-ink-600">{service.description}</p>

      {/* Not positioned itself: its ::after stretches over the whole card. */}
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-haspopup="dialog"
        aria-label={`${learnMore}: ${service.title}`}
        className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-royal-600 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
      >
        <span aria-hidden className="relative">
          {learnMore}
        </span>
        <ArrowRight size={16} aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
    </article>
  );
}
