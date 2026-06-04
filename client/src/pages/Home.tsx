import { useMutation } from "@tanstack/react-query";
import { type InsertContactSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Banner } from "@/components/Banner";
import { Testimonials } from "@/components/Testimonials";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
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
        <Services />
        <Banner />
        <Testimonials />
        <CaseStudies />
        <ContactForm
          onSubmit={handleContactSubmit}
          isPending={contactMutation.isPending}
          isSuccess={contactMutation.isSuccess}
        />
      </main>
      <Footer />
    </div>
  );
}
