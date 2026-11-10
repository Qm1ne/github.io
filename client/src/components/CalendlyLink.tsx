import { useEffect, useState } from "react";
import { trackCtaClick, withCampaign } from "@/lib/analytics";

export const CALENDLY_URL = "https://calendly.com/aiautomatetn/30min";

interface CalendlyLinkProps {
  /** Which control this is, recorded as `utm_content`. */
  location: string;
  campaign?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A plain link to the booking page, for the navigation, the banner and the
 * footer. No widget script: those surfaces are on every page, including the
 * articles, and none of them should pay for a third party.
 *
 * The campaign parameters are attached after mount rather than during render.
 * Attribution lives in sessionStorage, which does not exist while the page is
 * pre-rendered, so building the URL during render would make the server and
 * the browser disagree and break hydration. The bare URL works on its own, so
 * the link is never broken while it waits.
 */
export function CalendlyLink({
  location,
  campaign = "general",
  className,
  children,
}: CalendlyLinkProps) {
  const [href, setHref] = useState(CALENDLY_URL);

  useEffect(() => {
    setHref(withCampaign(CALENDLY_URL, campaign, location));
  }, [campaign, location]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackCtaClick({ location, campaign, destination: "calendly" })
      }
    >
      {children}
    </a>
  );
}
