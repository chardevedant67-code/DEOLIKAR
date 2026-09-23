/** Shared button class strings — kept static so Tailwind can see every class. */
const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[15px] font-semibold leading-none transition duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export const btnPrimary = `${base} bg-navy-950 text-white shadow-[0_12px_26px_-12px_rgba(1,20,52,0.7)] hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-[0_16px_30px_-12px_rgba(1,20,52,0.7)]`;

export const btnBlue = `${base} bg-royal-600 text-white shadow-[0_12px_26px_-12px_rgba(30,85,196,0.75)] hover:-translate-y-0.5 hover:bg-royal-700`;

export const btnSecondary = `${base} border border-mist-300 bg-white text-navy-950 hover:-translate-y-0.5 hover:border-royal-400 hover:text-royal-700`;

export const btnWhatsApp = `${base} border border-mint-500/40 bg-mint-50 text-mint-700 hover:-translate-y-0.5 hover:border-mint-500 hover:bg-mint-100`;

/** For use on navy backgrounds. */
export const btnLight = `${base} bg-white text-navy-950 shadow-[0_12px_26px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:bg-royal-50`;

export const btnOutlineLight = `${base} border border-white/30 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10`;
