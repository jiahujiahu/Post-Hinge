import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import type { CoupleProfile } from '@/types'
import { AvatarIllustration } from '@/components/AvatarIllustration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { archetypeLabel, personalizedGreeting } from '@/lib/personalization'
import { getArchetype } from '@/data/personality'
import { cn } from '@/lib/utils'

interface CoupleProfileHeaderProps {
  couple: CoupleProfile
  showEdit?: boolean
  compact?: boolean
  className?: string
}

export function CoupleProfileHeader({
  couple,
  showEdit = true,
  compact = false,
  className,
}: CoupleProfileHeaderProps) {
  const greeting = personalizedGreeting(couple)
  const archetype = getArchetype(couple.personality.primaryArchetype)
  const partners = couple.partners.length
    ? couple.partners
    : [
        {
          id: 'p1',
          name: couple.partnerOneName,
          avatarType: 'initials' as const,
          avatarValue: couple.partnerOneName,
          traits: [],
          personalPriorities: [],
        },
        {
          id: 'p2',
          name: couple.partnerTwoName,
          avatarType: 'initials' as const,
          avatarValue: couple.partnerTwoName,
          traits: [],
          personalPriorities: [],
        },
      ]

  return (
    <section
      className={cn(
        'rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-blush/30 p-5 shadow-card md:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {partners.map((partner) => (
              <AvatarIllustration
                key={partner.id}
                avatarType={partner.avatarType}
                avatarValue={partner.avatarValue}
                name={partner.name}
                size={compact ? 'md' : 'lg'}
                className="ring-4 ring-card"
              />
            ))}
          </div>
          <div>
            <p className="font-display text-2xl font-semibold md:text-3xl">
              {couple.partnerOneName} & {couple.partnerTwoName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="rose">{archetypeLabel(couple.personality.primaryArchetype)}</Badge>
              {couple.personality.secondaryTraits.map((trait) => (
                <Badge key={trait} variant="secondary">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {showEdit ? (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/profile">
              <Pencil /> Edit profile
            </Link>
          </Button>
        ) : null}
      </div>
      {!compact ? (
        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="font-display text-xl font-semibold text-burgundy md:text-2xl">{greeting.headline}</p>
          <p className="mt-2 text-sm text-muted-foreground">{greeting.subcopy}</p>
          <p className="mt-3 text-xs text-muted-foreground">{archetype.recommendation}</p>
        </div>
      ) : null}
    </section>
  )
}
