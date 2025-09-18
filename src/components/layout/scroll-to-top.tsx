"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "bg-background/50 hover:bg-background/80 glass-effect rounded-full h-12 w-12 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronUp className="h-6 w-6" />
        <span className="sr-only">بازگشت به بالا</span>
      </Button>
    </div>
  );
}
