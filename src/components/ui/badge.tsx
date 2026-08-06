import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-slate-200 bg-slate-100 text-slate-700",
        active:
          "border border-emerald-200 bg-emerald-50 text-emerald-700",
        inactive:
          "border border-amber-200 bg-amber-50 text-amber-700",
        info:
          "border border-blue-200 bg-blue-50 text-blue-700",
        destructive:
          "border border-red-200 bg-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withPulse?: boolean;
}

function Badge({ className, variant, withPulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {withPulse && variant === "active" && (
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {withPulse && variant === "inactive" && (
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
