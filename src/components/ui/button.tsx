import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--text-primary)] text-white shadow-[0_2px_8px_rgba(17,17,17,0.12)] hover:bg-[var(--accent)] hover:shadow-[0_4px_16px_rgba(47,75,255,0.25)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
        primary:
          "bg-[var(--text-primary)] text-white shadow-[0_2px_8px_rgba(17,17,17,0.12)] hover:bg-[var(--accent)] hover:shadow-[0_4px_16px_rgba(47,75,255,0.25)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98]",
        secondary:
          "bg-white text-[var(--text-primary)] border border-[var(--border)] shadow-[0_1px_3px_rgba(17,17,17,0.04)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-[1px] active:scale-[0.98]",
        ghost:
          "hover:bg-[var(--surface)] text-[var(--text-primary)] hover:text-[var(--accent)]",
        link:
          "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2 text-xs sm:text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
  target?: string
  rel?: string
  showArrow?: boolean
  external?: boolean
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size,
      asChild = false,
      href,
      target,
      rel,
      showArrow = false,
      external,
      children,
      ...props
    },
    ref,
  ) => {
    const isExternal =
      external !== undefined
        ? external
        : href && (href.startsWith("http://") || href.startsWith("https://"))

    const effectiveTarget = isExternal ? target || "_blank" : target
    const effectiveRel = isExternal ? rel || "noopener noreferrer" : rel

    const renderArrow = () => {
      if (!showArrow) return null
      return (
        <ArrowUpRight
          className="w-3.5 h-3.5 ml-1.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
          aria-hidden="true"
        />
      )
    }

    const content = (
      <>
        {children}
        {renderArrow()}
      </>
    )

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={effectiveTarget}
          rel={effectiveRel}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as any)}
        >
          {content}
        </a>
      )
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      >
        {content}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
