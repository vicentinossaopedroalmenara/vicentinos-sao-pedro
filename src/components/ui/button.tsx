import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        outline:
          "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white",
        destructive:
          "border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 text-slate-500",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
      },
      size: {
        sm: "h-8 rounded-xl px-3 py-1.5 text-xs gap-1.5",
        md: "h-10 rounded-xl px-5 py-2 text-sm gap-2",
        lg: "h-12 rounded-2xl px-8 py-3 text-base gap-2.5",
        icon: "h-8 w-8 rounded-xl p-1.5 justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
