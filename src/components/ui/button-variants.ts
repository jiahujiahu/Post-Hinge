import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-burgundy/90 hover:-translate-y-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-blush/70',
        outline: 'border border-border bg-card hover:bg-secondary/80 text-foreground',
        ghost: 'hover:bg-secondary/80 text-foreground',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        champagne: 'bg-champagne text-foreground hover:bg-champagne/80 shadow-soft',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
