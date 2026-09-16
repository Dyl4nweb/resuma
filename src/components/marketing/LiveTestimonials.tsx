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
];

export function LiveTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before showing the first toast
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // 3 seconds after page load

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed || !isVisible) return;

    // How long a toast stays visible before hiding
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Visible for 2.5 seconds

    return () => clearTimeout(hideTimer);
  }, [isVisible, isDismissed]);

  useEffect(() => {
    if (isDismissed || isVisible) return;

    // How long to wait before showing the next toast
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      setIsVisible(true);
    }, 500); // Wait 0.5s after hiding before showing the next one (Total cycle ~3s)

    return () => clearTimeout(nextTimer);
  }, [isVisible, isDismissed]);

  if (isDismissed) return null;

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-full max-w-[320px] transition-all duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-2 rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-2 flex items-center gap-1">
          {[...Array(currentTestimonial.rating)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-[10px] text-zinc-500 font-medium">Just now</span>
        </div>

        <p className="mb-3 text-sm text-zinc-200 leading-relaxed italic">
          "{currentTestimonial.text}"
        </p>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-xs font-bold text-white shadow-inner">
            {currentTestimonial.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{currentTestimonial.name}</p>
            <p className="text-[10px] text-zinc-400">
              {currentTestimonial.role} &bull; {currentTestimonial.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
