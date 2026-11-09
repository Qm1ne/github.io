import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useTranslation } from "react-i18next";

export function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  const testimonials = [
    {
      quote: t('testimonials.t1_quote'),
      author: t('testimonials.t1_author'),
      position: t('testimonials.t1_pos'),
      initials: "AH",
    },
    {
      quote: t('testimonials.t2_quote'),
      author: t('testimonials.t2_author'),
      position: t('testimonials.t2_pos'),
      initials: "LM",
    },
    {
      quote: t('testimonials.t3_quote'),
      author: t('testimonials.t3_author'),
      position: t('testimonials.t3_pos'),
      initials: "RO",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-testimonials-title"
          >
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className={`relative max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="hidden lg:flex shrink-0"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* All three quotes are rendered as a sliding track rather than
                one at a time, so every testimonial is present in the HTML for
                crawlers and readers without scripting. */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="w-full shrink-0 p-8 lg:p-12">
                    <div className="space-y-6">
                      <Quote className="h-10 w-10 text-primary/20" />
                      <p
                        className="text-lg lg:text-xl text-foreground leading-relaxed"
                        data-testid={`text-testimonial-quote-${index}`}
                      >
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className="font-semibold text-foreground"
                            data-testid={`text-testimonial-author-${index}`}
                          >
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="hidden lg:flex shrink-0"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex lg:hidden items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              data-testid="button-testimonial-prev-mobile"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-primary w-8" : "bg-muted"
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              data-testid="button-testimonial-next-mobile"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden lg:flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted"
                }`}
                data-testid={`button-testimonial-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
