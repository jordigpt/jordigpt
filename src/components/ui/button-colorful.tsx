import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-10 px-4 overflow-hidden rounded-full",
                "bg-zinc-900 dark:bg-zinc-950",
                "transition-all duration-200",
                "group border border-border",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-neon/60 via-[#fcfda8] to-neon/60",
                    "opacity-20 group-hover:opacity-60",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-white dark:text-zinc-100 font-bold tracking-wide uppercase">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-neon" />
            </div>
        </Button>
    );
}