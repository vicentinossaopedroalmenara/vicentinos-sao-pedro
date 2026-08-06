import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const inputVariants = cva(
  "flex w-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 shadow-sm",
        mono:
          "bg-white border-slate-300 font-mono text-emerald-600 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30 shadow-sm",
        error:
          "bg-red-50 border-red-300 text-slate-900 placeholder:text-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30 shadow-sm",
      },
      inputSize: {
        sm: "h-9 rounded-xl px-3 py-1.5 text-xs",
        md: "h-11 rounded-xl px-4 py-2.5 text-sm",
        lg: "h-12 rounded-2xl px-5 py-3 text-base shadow-inner",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
