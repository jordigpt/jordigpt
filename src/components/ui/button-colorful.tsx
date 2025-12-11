import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonColorfulProps extends ButtonProps {
  children: React.ReactNode;
}

export const ButtonColorful = React.forwardRef<HTMLButtonElement, ButtonColorfulProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative group overflow-hidden rounded-lg bg-neon text-neon-foreground font-bold shadow-[0_0_20px_rgba(212,232,58,0.3)] hover:shadow-[0_0_30px_rgba(212,232,58,0.5)] transition-shadow duration-300",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Efecto de hover */}
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/30 rounded-full group-hover:w-56 group-hover:h-56 opacity-50"></span>
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);
ButtonColorful.displayName = "ButtonColorful";