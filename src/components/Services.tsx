"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { usePlanner } from "@/lib/planner-context";
import { ServiceCard } from "./ServiceCard";
import { ServiceModal } from "./ServiceModal";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Services() {
  const { t } = useLanguage();
  const { serviceIndex, setServiceIndex } = usePlanner();

  return (
    <section id="services" aria-labelledby="services-heading" className="relative bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          id="services-heading"
          eyebrow={t.nav.services}
          heading={t.services.heading}
          subheading={t.services.subheading}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
          {t.services.items.map((service, i) => (
            <li key={service.key}>
              <Reveal delay={(i % 4) * 80} className="h-full">
                <ServiceCard service={service} index={i} learnMore={t.services.learnMore} onOpen={setServiceIndex} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <ServiceModal index={serviceIndex} onChange={setServiceIndex} />
    </section>
  );
}
