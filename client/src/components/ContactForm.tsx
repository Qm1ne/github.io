import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactFormProps {
  onSubmit: (data: InsertContactSubmission) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export function ContactForm({ onSubmit, isPending, isSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  const handleSubmit = async (data: InsertContactSubmission) => {
    // Send via EmailJS first (client-side). Template fields: name, Phone, email, message
    const emailPayload = {
      name: data.name,
      Phone: data.phone,
      email: data.email,
      message: data.message,
    };
    
    // eslint-disable-next-line no-console
    console.log("Attempting to send email with payload:", emailPayload);
    
    try {
      const response = await emailjs.send(
        "service_csz2oen",
        "template_jfhhfs4",
        emailPayload,
        "bztEB7S1n0g91s85-"
      );
      // eslint-disable-next-line no-console
      console.log("EmailJS response:", response);
    } catch (err) {
      // Log errors but continue with existing onSubmit flow so UI behaviour doesn't change
      // eslint-disable-next-line no-console
      console.error("EmailJS send error:", err);
    }

    // Continue with existing submission flow (server, DB, toast, etc.)
    onSubmit(data);
  };

  return (
    <section id="contact" ref={ref} className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-contact-title"
          >
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.name_label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('contact.name_placeholder')}
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.email_label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('contact.email_placeholder')}
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.phone_label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder={t('contact.phone_placeholder')}
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.message_label')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('contact.message_placeholder')}
                          className="min-h-32 resize-none"
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base"
                  disabled={isPending}
                  data-testid="button-submit-contact"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    t('contact.submit')
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {t('contact.info_title')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.info_email')}</p>
                    <p className="text-muted-foreground">contact@aiautomatetn.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.info_phone')}</p>
                    <p className="text-muted-foreground">+216 53 917 059</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.info_location')}</p>
                    <p className="text-muted-foreground">{t('contact.info_loc_val')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.info_hours')}</p>
                    <p className="text-muted-foreground">{t('contact.info_hours_val')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
