"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setIsError(false);

    if (!text.trim()) {
      setMessage("Please enter your feedback text.");
      setIsError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, text }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setMessage("Thank you! Your feedback has been submitted.");
      setIsError(false);
      setTimeout(() => {
        setOpen(false);
        setText("");
        setRating(5);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center justify-start rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800"
      >
        <Star className="mr-2 h-4 w-4" />
        Leave Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Leave Feedback
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Tell us how we can improve. If you love Resuma, let us know! We might feature your feedback on our page.
            </p>

            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">Rate your experience</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-colors"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        (hoverRating || rating) >= star
                          ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-500 dark:text-indigo-500"
                          : "fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <textarea
                id="feedback"
                placeholder="What do you think about Resuma?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-32 w-full resize-none rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-neutral-800 dark:text-neutral-50"
              />
            </div>

            {message && (
              <p className={cn("mt-2 text-sm", isError ? "text-red-600" : "text-green-600")}>
                {message}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
