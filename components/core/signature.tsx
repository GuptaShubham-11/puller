import { cn } from "@/lib/utils";

export function Signature({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                className
            )}
        >
            <h1
                className={cn(
                    "absolute left-1/2 top-10 -translate-x-1/2",
                    "select-none whitespace-nowrap",
                    "font-space-grotesk-heading",
                    "text-9xl font-bold",
                    "text-foreground/5",
                    "[-webkit-text-stroke:0.4px_oklch(from_currentColor_l_c_h/0.04)]"
                )}
            >
                dyit
            </h1>

            <div className="absolute inset-0 bg-radial from-transparent via-background/10 to-background" />
        </div>
    );
}