"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

// You can replace these with the actual testimonials from your users
const TESTIMONIALS = [
  {
    id: 1,
    name: "Klein Tablarin",
    role: "User",
    location: "Philippines",
    text: "Easy access resume building platform and beginner friendly",
    rating: 5,
  },
  {
    id: 2,
    name: "Jake B.",
    role: "User",
    location: "Philippines",
    text: "Your project is really useful, so having a few more [templates] would make it even better.",
    rating: 5,
  },
  {
    id: 3,
    name: "Lj Bugarin",
    role: "User",
    location: "Philippines",
    text: "Your web app is really good and very useful.",
    rating: 5,
  },
  {
    id: 4,
    name: "Vhan Jasfer",
    role: "User",
    location: "Philippines",
    text: "I don't see any problems with it so far. Everything looks well put together, and your marketing strategy is really good—it caught my attention right away.",
    rating: 5,
  },
  {
    id: 5,
    name: "Liza",
    role: "User",
    location: "Global",
    text: "Your app is really helpful, especially for people who struggle with creating resumes. It makes the process much faster and gives users a better idea of how to make a resume. The only issue is that the dark theme can be a bit hard on the eyes.",
    rating: 4,
  },
];

export function LiveTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [combinedTestimonials, setCombinedTestimonials] = useState(TESTIMONIALS);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback/public");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCombinedTestimonials([...TESTIMONIALS, ...data]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch public feedbacks", error);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past the hero section (sync with navbar)
      if (window.scrollY > (window.innerHeight * 1.2)) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDismissed) return;
    
    if (!hasScrolled) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, [isDismissed, hasScrolled]);

  useEffect(() => {
    if (isDismissed || !isVisible || !hasScrolled) return;

    // How long a toast stays visible before hiding
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Visible for 4.5 seconds

    return () => clearTimeout(hideTimer);
  }, [isVisible, isDismissed, hasScrolled]);

  useEffect(() => {
    if (isDismissed || isVisible || !hasScrolled) return;

    // How long to wait before showing the next toast
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedTestimonials.length);
      setIsVisible(true);
    }, 500); 

    return () => clearTimeout(nextTimer);
  }, [isVisible, isDismissed, combinedTestimonials.length, hasScrolled]);

  if (isDismissed) return null;

  const currentTestimonial = combinedTestimonials[currentIndex];

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-full max-w-[280px] sm:max-w-[320px] transition-all duration-700 ease-out ${
        isVisible && hasScrolled
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-accent-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div className="mb-1.5 sm:mb-2 flex items-center gap-1">
          {[...Array(currentTestimonial.rating)].map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-[9px] sm:text-[10px] text-muted-foreground font-medium">Just now</span>
        </div>

        <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-foreground leading-relaxed italic">
          "{currentTestimonial.text}"
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-[10px] sm:text-xs font-bold text-white shadow-inner">
            {currentTestimonial.name.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-foreground">{currentTestimonial.name}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">
              {currentTestimonial.role} &bull; {currentTestimonial.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
