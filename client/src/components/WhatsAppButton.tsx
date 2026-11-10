import { SiWhatsapp } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "21653917059";

/** A chat link with the first message already written, in the page's language. */
function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppButtonProps extends Omit<ButtonProps, "asChild"> {
  campaign: string;
  location: string;
  /** Translation key for the message the chat opens with. */
  messageKey?: string;
  children: React.ReactNode;
}

export function WhatsAppButton({
  campaign,
  location,
  messageKey = "whatsapp.message",
  children,
  ...buttonProps
}: WhatsAppButtonProps) {
  const { t } = useTranslation();

  return (
    <Button {...buttonProps} asChild>
      <a
        href={whatsappHref(t(messageKey))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackCtaClick({ location, campaign, destination: "whatsapp" })
        }
      >
        {children}
      </a>
    </Button>
  );
}

/**
 * The floating chat button.
 *
 * It sits below the sticky navigation in the stacking order so it can never
 * cover the menu, and it is a plain link so it works without scripting.
 */
export function WhatsAppFab({
  campaign,
  messageKey = "whatsapp.message",
}: {
  campaign: string;
  /** Translation key for the message the chat opens with. */
  messageKey?: string;
}) {
  const { t } = useTranslation();
  const label = t("whatsapp.aria");

  return (
    <a
      href={whatsappHref(t(messageKey))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={() =>
        trackCtaClick({ location: "floating", campaign, destination: "whatsapp" })
      }
      data-testid="link-whatsapp-floating"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <SiWhatsapp className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
