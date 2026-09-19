"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Start fading out after 3.5 seconds to give plenty of time to see the animation
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3500);

    // Completely remove after 4 seconds
    const removeTimer = setTimeout(() => {
      document.body.style.overflow = "unset";
      setShow(false);
    }, 4000);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] pointer-events-auto transition-opacity duration-500 bg-background ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <LoadingSpinner fullScreen={true} />
    </div>
  );
}
