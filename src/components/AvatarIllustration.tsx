import { AVATAR_OPTIONS } from '@/data/personality'
import { cn } from '@/lib/utils'

interface AvatarIllustrationProps {
  avatarType: 'illustration' | 'initials' | 'upload'
  avatarValue: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-2xl',
}

function initialsFrom(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function AvatarIllustration({
  avatarType,
  avatarValue,
  name,
  size = 'md',
  className,
}: AvatarIllustrationProps) {
  const option = AVATAR_OPTIONS.find((item) => item.id === avatarValue)
  const [c1, c2] = option?.colors ?? ['#7A3040', '#E8D5B7']

  if (avatarType === 'upload' && avatarValue.startsWith('data:')) {
    return (
      <img
        src={avatarValue}
        alt={`${name} profile`}
        className={cn('rounded-full object-cover shadow-soft ring-2 ring-champagne/70', sizeMap[size], className)}
      />
    )
  }

  if (avatarType === 'initials') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-burgundy font-display font-semibold text-primary-foreground shadow-soft ring-2 ring-champagne/70',
          sizeMap[size],
          className,
        )}
        aria-label={`${name} initials`}
      >
        {initialsFrom(name)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full shadow-soft ring-2 ring-champagne/70',
        sizeMap[size],
        className,
      )}
      aria-label={`${name} avatar, ${option?.label ?? 'illustration'}`}
      style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full" role="img" aria-hidden="true">
        <circle cx="40" cy="30" r="14" fill="rgba(255,255,255,0.35)" />
        <path
          d="M18 72c4-16 14-24 22-24s18 8 22 24"
          fill="rgba(255,255,255,0.28)"
        />
        <circle cx="40" cy="28" r="10" fill="rgba(44,36,32,0.18)" />
        <path
          d="M26 26c2-8 8-12 14-12s12 4 14 12"
          fill="none"
          stroke="rgba(44,36,32,0.25)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
