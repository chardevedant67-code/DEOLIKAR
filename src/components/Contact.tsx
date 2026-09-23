"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Globe, Mail, Phone, ShieldCheck, TriangleAlert } from "lucide-react";
import { CONTACT, MAILTO_HREF, TEL_HREF, buildMailto, buildWhatsAppLink } from "@/lib/contact";
import { fill } from "@/lib/format";
import { serviceKeys, type ServiceKey } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { usePlanner } from "@/lib/planner-context";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { Logo } from "./Logo";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { btnBlue, btnLight } from "./ui/buttons";

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "phone" | "email" | "requirement" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "success" | "fallback" | "error";

/** Accepts pasted numbers like "+91 98765 43210" or "098765 43210" and keeps the 10-digit mobile. */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function Contact() {
  const { t } = useLanguage();
  const { requirement, setRequirement, goal } = usePlanner();
  const f = t.contact.form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // null = untouched, so a goal chosen in the Goal Planner can prefill it (and follow the language).
  const [message, setMessage] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState<{ subject: string; body: string } | null>(null);

  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>>({});

  const prefill = goal ? fill(t.goalPlanner.messageTemplate, { goal: t.goalPlanner.goals[goal] }) : "";
  const messageValue = message ?? prefill;
  const requirementLabel = requirement ? f.requirementOptions[requirement] : "";

  const validateField = (field: Field): string => {
    switch (field) {
      case "name":
        return name.trim() ? "" : f.errors.nameRequired;
      case "phone":
        if (!phone.trim()) return f.errors.phoneRequired;
        return PHONE_RE.test(phone) ? "" : f.errors.phoneInvalid;
      case "email":
        if (!email.trim()) return f.errors.emailRequired;
        return EMAIL_RE.test(email.trim()) ? "" : f.errors.emailInvalid;
      case "requirement":
        return requirement ? "" : f.errors.requirementRequired;
      case "message":
        return messageValue.trim() ? "" : f.errors.messageRequired;
    }
  };

  const onBlurField = (field: Field) => () => {
    const error = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const clearError = (field: Field) => setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const fields: Field[] = ["name", "phone", "email", "requirement", "message"];
    const next: Errors = {};
    for (const field of fields) {
      const error = validateField(field);
      if (error) next[field] = error;
    }
    setErrors(next);
    const firstInvalid = fields.find((field) => next[field]);
    if (firstInvalid) {
      refs.current[firstInvalid]?.focus();
      return;
    }

    const details = [
      `${f.nameLabel}: ${name.trim()}`,
      `${f.phoneLabel}: ${phone}`,
      `${f.emailLabel}: ${email.trim()}`,
      `${f.requirementLabel}: ${requirementLabel}`,
      `${f.messageLabel}: ${messageValue.trim()}`,
    ].join("\n");
    setSummary({ subject: f.title, body: details });

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          email: email.trim(),
          requirement: f.requirementOptions[requirement as ServiceKey | "general"],
          message: messageValue.trim(),
          company_url: trap,
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      const data: { delivered?: boolean } = await res.json();
      setStatus(data.delivered ? "success" : "fallback");
      setName("");
      setPhone("");
      setEmail("");
      setMessage(null);
      setRequirement("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field: Field) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] text-navy-950 outline-none transition placeholder:text-ink-400 focus:ring-4 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-mist-300 focus:border-royal-500 focus:ring-royal-100"
    }`;

  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
        {errors[field]}
      </p>
    ) : null;

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  const whatsappFallback = summary ? buildWhatsAppLink(`${f.fallbackWhatsappMessage}\n\n${summary.body}`) : buildWhatsAppLink(f.fallbackWhatsappMessage);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative bg-mist-50 py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="bg-hairline-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-page relative">
        <SectionHeading id="contact-heading" eyebrow={t.nav.contact} heading={t.contact.heading} />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-12">
          {/* Details */}
          <Reveal className="h-full lg:col-span-5" variant="left">
            <div className="on-dark relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-lift sm:p-9">
              <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-royal-500/25 blur-3xl" />
              <div className="relative">
                <Logo className="w-44 sm:w-52" sizes="220px" />
                <h3 className="mt-7 font-display text-lg font-bold leading-snug tracking-tight sm:text-xl">{t.contact.companyName}</h3>
                <p className="mt-1.5 text-sm text-white/65">{t.contact.tagline}</p>

                <ul className="mt-8 space-y-5">
                  <li>
                    <a href={TEL_HREF} className="group flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-royal-500">
                        <Phone size={18} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-xs font-medium text-white/55">{t.contact.mobileLabel}</span>
                        <span className="tabular text-[17px] font-semibold tracking-wide">{CONTACT.phoneDisplay}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href={MAILTO_HREF} className="group flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-royal-500">
                        <Mail size={18} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-white/55">{t.contact.emailLabel}</span>
                        <span className="block break-all text-[15px] font-semibold sm:text-[17px]">{CONTACT.email}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href={`https://${CONTACT.website}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-royal-500">
                        <Globe size={18} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-xs font-medium text-white/55">{t.contact.websiteLabel}</span>
                        <span className="text-[17px] font-semibold">{CONTACT.website}</span>
                        <span className="sr-only">{t.a11y.opensInNewTab}</span>
                      </span>
                    </a>
                  </li>
                </ul>

                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-sm">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-mint-400" aria-hidden />
                  <p>
                    <span className="block font-medium text-white/85">{t.contact.amfi}</span>
                    <span className="tabular mt-0.5 block font-bold tracking-wide text-white">{t.trust.arn}</span>
                  </p>
                </div>
              </div>

              <div className="relative mt-auto pt-8">
                <div className="rounded-2xl bg-white p-5 text-navy-950">
                  <p className="font-display text-base font-extrabold tracking-tight">{t.contact.freeConsultTitle}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{t.contact.freeConsultText}</p>
                  <a
                    href={buildWhatsAppLink(t.floating.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-mint-50 px-4 text-sm font-semibold text-mint-700 ring-1 ring-mint-500/30 transition-colors hover:bg-mint-100"
                  >
                    <WhatsAppIcon size={17} />
                    {t.hero.whatsappUs}
                    <span className="sr-only">{t.a11y.opensInNewTab}</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="h-full lg:col-span-7" variant="right" delay={100}>
            <div className="h-full rounded-[2rem] border border-mist-200 bg-white p-6 shadow-soft sm:p-9">
              {status === "success" || status === "fallback" ? (
                <div role="status" className="flex flex-col items-start gap-5 py-6 sm:py-10">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-50 text-mint-600 ring-1 ring-mint-500/30">
                    {status === "success" ? (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path className="check-path" d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    ) : (
                      <CheckCircle2 size={30} aria-hidden />
                    )}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
                      {status === "success" ? f.successTitle : f.fallbackTitle}
                    </h3>
                    <p className="mt-2 max-w-md text-base leading-relaxed text-ink-600">
                      {status === "success" ? f.successText : f.fallbackText}
                    </p>
                  </div>
                  {status === "fallback" && summary ? (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className={`${btnBlue} !bg-mint-600 hover:!bg-mint-700`}>
                        <WhatsAppIcon size={18} />
                        {f.fallbackWhatsapp}
                        <span className="sr-only">{t.a11y.opensInNewTab}</span>
                      </a>
                      <a href={buildMailto(summary.subject, summary.body)} className={btnLight + " !bg-mist-100 hover:!bg-mist-200"}>
                        <Mail size={18} aria-hidden />
                        {f.fallbackEmail}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title">
                  <h3 id="contact-form-title" className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-500">{f.requiredNote}</p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-950">
                        {f.nameLabel}
                      </label>
                      <input
                        ref={(el) => {
                          refs.current.name = el;
                        }}
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder={f.namePlaceholder}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          clearError("name");
                        }}
                        onBlur={onBlurField("name")}
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={describedBy("name")}
                        className={inputClass("name")}
                      />
                      {fieldError("name")}
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-950">
                        {f.phoneLabel}
                      </label>
                      <input
                        ref={(el) => {
                          refs.current.phone = el;
                        }}
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder={f.phonePlaceholder}
                        value={phone}
                        onChange={(e) => {
                          setPhone(normalizePhone(e.target.value));
                          clearError("phone");
                        }}
                        onBlur={onBlurField("phone")}
                        required
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={describedBy("phone")}
                        className={`tabular ${inputClass("phone")}`}
                      />
                      {fieldError("phone")}
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-950">
                        {f.emailLabel}
                      </label>
                      <input
                        ref={(el) => {
                          refs.current.email = el;
                        }}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={f.emailPlaceholder}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError("email");
                        }}
                        onBlur={onBlurField("email")}
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                        className={inputClass("email")}
                      />
                      {fieldError("email")}
                    </div>

                    <div>
                      <label htmlFor="requirement" className="mb-1.5 block text-sm font-semibold text-navy-950">
                        {f.requirementLabel}
                      </label>
                      <div className="relative">
                        <select
                          ref={(el) => {
                            refs.current.requirement = el;
                          }}
                          id="requirement"
                          name="requirement"
                          value={requirement}
                          onChange={(e) => {
                            setRequirement(e.target.value as ServiceKey | "general" | "");
                            clearError("requirement");
                          }}
                          onBlur={onBlurField("requirement")}
                          required
                          aria-invalid={Boolean(errors.requirement)}
                          aria-describedby={describedBy("requirement")}
                          className={`${inputClass("requirement")} appearance-none pr-11 ${requirement ? "" : "text-ink-400"}`}
                        >
                          <option value="" disabled>
                            {f.requirementPlaceholder}
                          </option>
                          {[...serviceKeys, "general" as const].map((key) => (
                            <option key={key} value={key} className="text-navy-950">
                              {f.requirementOptions[key]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-500" />
                      </div>
                      {fieldError("requirement")}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy-950">
                        {f.messageLabel}
                      </label>
                      <textarea
                        ref={(el) => {
                          refs.current.message = el;
                        }}
                        id="message"
                        name="message"
                        rows={5}
                        placeholder={f.messagePlaceholder}
                        value={messageValue}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          clearError("message");
                        }}
                        onBlur={onBlurField("message")}
                        required
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={describedBy("message")}
                        className={`${inputClass("message")} resize-y`}
                      />
                      {fieldError("message")}
                    </div>

                    {/* Honeypot — real visitors never see or fill this */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <input
                        id="company_url"
                        name="company_url"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-label="Leave this field empty"
                        value={trap}
                        onChange={(e) => setTrap(e.target.value)}
                      />
                    </div>
                  </div>

                  {Object.values(errors).some(Boolean) ? (
                    <p role="alert" className="mt-5 flex items-center gap-2 text-sm font-medium text-red-600">
                      <TriangleAlert size={16} aria-hidden />
                      {f.errors.fixErrors}
                    </p>
                  ) : null}

                  {status === "error" ? (
                    <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
                      <p>
                        <span className="font-semibold">{f.errorTitle}. </span>
                        {f.errorText}
                      </p>
                    </div>
                  ) : null}

                  <button type="submit" disabled={status === "submitting"} className={`${btnBlue} mt-7 w-full sm:w-auto`}>
                    {status === "submitting" ? f.submitting : f.submit}
                    <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
