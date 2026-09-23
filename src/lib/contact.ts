export const CONTACT = {
  phoneDisplay: "90755 45105",
  phoneTel: "9075545105",
  phoneIntl: "919075545105",
  email: "info@deolikarwealth.com",
  website: "deolikarwealth.com",
  arn: "289210",
} as const;

export const TEL_HREF = `tel:${CONTACT.phoneTel}`;
export const MAILTO_HREF = `mailto:${CONTACT.email}`;
export const SITE_URL = "https://deolikarwealth.com";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${CONTACT.phoneIntl}?text=${encodeURIComponent(message)}`;
}

export function buildMailto(subject: string, body: string): string {
  return `${MAILTO_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
