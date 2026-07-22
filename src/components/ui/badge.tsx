import type { HTMLAttributes } from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { badgeVariants } from '@/components/ui/badge-variants'

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
