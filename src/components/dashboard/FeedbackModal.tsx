"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter your feedback text.");
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

      toast.success("Thank you! Your feedback has been submitted.");
      setOpen(false);
      setText("");
      setRating(5);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start mt-4">
          <Star className="mr-2 h-4 w-4" />
          Leave Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Feedback</DialogTitle>
          <DialogDescription>
            Tell us how we can improve. If you love Resuma, let us know! We might feature your feedback on our page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Rate your experience</span>
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
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              id="feedback"
              placeholder="What do you think about Resuma?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
