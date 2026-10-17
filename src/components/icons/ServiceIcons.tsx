import type { ServiceKey } from "@/lib/i18n/dictionary";

/**
 * Bespoke two-tone icon set for the services. One 48×48 grid, 2px round
 * strokes: the primary shape uses currentColor, and the accent shape uses
 * `--icon-accent` so hover states can shift the accent without touching layout.
 */
interface IconProps {
  className?: string;
}

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

const accent = { stroke: "var(--icon-accent, #2f6fe4)" } as const;
const accentFill = { stroke: "var(--icon-accent, #2f6fe4)", fill: "var(--icon-accent-soft, rgba(47,111,228,0.14))" } as const;

/** Portfolio: a pie with one slice pulled out. */
export function PortfolioIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M22 26V11A15 15 0 1 0 37 26Z" />
      <path d="M25 23V8A15 15 0 0 1 40 23Z" style={accentFill} />
    </Svg>
  );
}

/** SIP: a calendar with a recurring-payment badge. */
export function SipIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="10" width="30" height="28" rx="5" />
      <path d="M6 19h30M14 6v8M28 6v8" />
      <path d="M13 26h.01M21 26h.01M29 26h.01M13 32h.01M21 32h.01" strokeWidth="3" />
      <circle cx="37" cy="36" r="8" fill="var(--icon-badge-bg, #fff)" style={accent} />
      <path d="M33.6 36a3.5 3.5 0 0 1 6-2.4M40.4 36a3.5 3.5 0 0 1-6 2.4M39.6 31.4v2.4h-2.4M34.4 40.6v-2.4h2.4" style={accent} strokeWidth="1.6" />
    </Svg>
  );
}

/** SIF: a target with a strategy arrow. */
export function SifIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="21" cy="27" r="15" />
      <circle cx="21" cy="27" r="8" />
      <circle cx="21" cy="27" r="2" style={accentFill} />
      <path d="M22.5 25.5 38 10M31 9.5h7.5V17" style={accent} />
    </Svg>
  );
}

/** SWP: a corpus with a steady outflow. */
export function WithdrawalIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <ellipse cx="18" cy="13" rx="11" ry="5" />
      <path d="M7 13v20c0 2.8 4.9 5 11 5s11-2.2 11-5V13M7 23c0 2.8 4.9 5 11 5s11-2.2 11-5" />
      <path d="M32 26h12M40 21l4 5-4 5" style={accent} />
    </Svg>
  );
}

/** STP: two funds with transfer arrows. */
export function TransferIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 17h30M31 10l7 7-7 7" />
      <path d="M40 32H10M17 25l-7 7 7 7" style={accent} />
    </Svg>
  );
}

/** ETF: an exchange screen tracking an index. */
export function ExchangeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="8" width="36" height="26" rx="4" />
      <path d="M18 42h12M24 34v8" />
      <path d="m12 27 6-6 5 4 6-8 7 5" style={accent} />
    </Svg>
  );
}

/** Insurance: a shield with a check. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M24 5 38 10.5V23c0 9-6 16-14 20-8-4-14-11-14-20V10.5Z" />
      <path d="m17.5 24 4.5 4.5 8.5-9" style={accent} />
    </Svg>
  );
}

/** NPS: a sunrise — the future, arriving. */
export function SunriseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 35h38M9 42h30" />
      <path d="M14 35a10 10 0 0 1 20 0" style={accentFill} />
      <path d="M24 13v5M11.5 21.5l3.5 3.5M36.5 21.5 33 25" style={accent} />
    </Svg>
  );
}

/** Bonds: a certificate with a seal. */
export function CertificateIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 6h15l9 9v25a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      <path d="M27 6v9h9M16 23h15M16 29h8" />
      <circle cx="31" cy="35" r="5" style={accentFill} />
      <path d="m28.5 39.5-1 5 3.5-1.8 3.5 1.8-1-5" style={accent} />
    </Svg>
  );
}

/** Portfolio Management: a briefcase holding a managed growth line. */
export function BriefcaseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="15" width="36" height="25" rx="4" />
      <path d="M17 15v-2.5a3.5 3.5 0 0 1 3.5-3.5h7a3.5 3.5 0 0 1 3.5 3.5V15" />
      <path d="m13 33 7-6 5 4 10-9" style={accent} />
      <path d="M30 22h5v5" style={accent} />
    </Svg>
  );
}

const ICONS: Record<ServiceKey, (props: IconProps) => React.ReactElement> = {
  mutualFunds: PortfolioIcon,
  sip: SipIcon,
  sif: SifIcon,
  swp: WithdrawalIcon,
  stp: TransferIcon,
  etf: ExchangeIcon,
  portfolioManagement: BriefcaseIcon,
  insurance: ShieldIcon,
  nps: SunriseIcon,
  bonds: CertificateIcon,
};

export function ServiceIcon({ service, className }: { service: ServiceKey; className?: string }) {
  const Icon = ICONS[service];
  return <Icon className={className} />;
}
