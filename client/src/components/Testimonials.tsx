import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    quote:
      "The AI automation solutions transformed our workflow completely. We've saved over 20 hours per week on manual tasks.",
    author: "Karim Ben Ahmed",
    position: "CEO, TechStart Tunisia",
    initials: "KA",
  },
  {
    quote:
      "Their CRM integration expertise helped us consolidate our customer data and improve our sales pipeline by 40%.",
    author: "Leila Mansour",
    position: "Operations Director, Digital Solutions",
    initials: "LM",
  },
  {
    quote:
      "Outstanding n8n consulting service. They built custom automations that perfectly fit our business needs.",
    author: "Mohamed Trabelsi",
    position: "Founder, GrowthHub",
    initials: "MT",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

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
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real results from businesses we've helped transform
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

            <Card className="flex-1 p-8 lg:p-12">
              <div className="space-y-6">
                <Quote className="h-10 w-10 text-primary/20" />
                <p
                  className="text-lg lg:text-xl text-foreground leading-relaxed"
                  data-testid={`text-testimonial-quote-${currentIndex}`}
                >
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonials[currentIndex].initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className="font-semibold text-foreground"
                      data-testid={`text-testimonial-author-${currentIndex}`}
                    >
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].position}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

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
