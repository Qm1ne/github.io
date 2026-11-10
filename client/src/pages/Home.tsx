import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import emailjs from "@emailjs/browser";
import { type InsertContactSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { EnergyFeature } from "@/components/EnergyFeature";
import { Services } from "@/components/Services";
import { Banner } from "@/components/Banner";
import { Testimonials } from "@/components/Testimonials";
import { CaseStudies } from "@/components/CaseStudies";
import { WhoBuildsThis } from "@/components/WhoBuildsThis";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppButton";
import { attributionLine, captureAttribution, trackLead } from "@/lib/analytics";
import { useTranslation } from "react-i18next";

// The site is served as static files, so the contact form is delivered by
// EmailJS. Its result is what decides success: there is no server behind this.
const EMAILJS_SERVICE_ID = "service_csz2oen";
const EMAILJS_TEMPLATE_ID = "template_jfhhfs4";

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Recorded once per session, before anyone can reach the form.
  useEffect(() => {
    captureAttribution();
  }, []);

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      // Template fields: name, Phone, email, message.
      //
      // The campaign is appended to the message rather than sent as its own
      // variable, because an EmailJS template only renders the variables it
      // already declares: a new one would be dropped silently and the
      // attribution would never arrive.
      const campaign = attributionLine();
      const message = campaign ? `${data.message}\n\n---\n${campaign}` : data.message;

      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: data.name,
        Phone: data.phone,
        email: data.email,
        message,
      });
    },
    onSuccess: () => {
      // EmailJS has accepted the enquiry, so this is a confirmed conversion
      // rather than a submit click.
      trackLead({ location: "home-contact-form", campaign: "general" });
      toast({
        title: t('home.success_title'),
        description: t('home.success_desc'),
      });
    },
    onError: () => {
      toast({
        title: t('home.error_title'),
        description: t('home.error_desc'),
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (data: InsertContactSubmission) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <EnergyFeature />
        <Services />
        <Banner />
        <Testimonials />
        <CaseStudies />
        <WhoBuildsThis />
        <ContactForm
          onSubmit={handleContactSubmit}
          isPending={contactMutation.isPending}
          isSuccess={contactMutation.isSuccess}
        />
      </main>
      <WhatsAppFab campaign="general" />
      <Footer />
    </div>
  );
}
