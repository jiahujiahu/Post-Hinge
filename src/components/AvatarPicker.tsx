import { AVATAR_OPTIONS } from '@/data/personality'
import type { AvatarType } from '@/types'
import { AvatarIllustration } from '@/components/AvatarIllustration'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AvatarPickerProps {
  name: string
  avatarType: AvatarType
  avatarValue: string
  onChange: (next: { avatarType: AvatarType; avatarValue: string }) => void
}

export function AvatarPicker({ name, avatarType, avatarValue, onChange }: AvatarPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <AvatarIllustration avatarType={avatarType} avatarValue={avatarValue} name={name} size="lg" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">Choose how you appear in AfterHinge.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={`${name} avatar style`}>
        {(
          [
            ['illustration', 'Choose an avatar'],
            ['initials', 'Use initials'],
            ['upload', 'Upload a photo'],
          ] as const
        ).map(([type, label]) => (
          <Button
            key={type}
            type="button"
            size="sm"
            variant={avatarType === type ? 'default' : 'outline'}
            aria-pressed={avatarType === type}
            onClick={() => {
              if (type === 'initials') onChange({ avatarType: 'initials', avatarValue: name })
              else if (type === 'illustration')
                onChange({
                  avatarType: 'illustration',
                  avatarValue: avatarValue.startsWith('avatar_') ? avatarValue : 'avatar_aurora',
                })
              else onChange({ avatarType: 'upload', avatarValue })
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {avatarType === 'illustration' ? (
        <div>
          <Label className="mb-2 block">Avatar illustrations</Label>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-label={`Select ${option.label} avatar`}
                aria-pressed={avatarValue === option.id}
                onClick={() => onChange({ avatarType: 'illustration', avatarValue: option.id })}
                className={cn(
                  'rounded-2xl border p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  avatarValue === option.id
                    ? 'border-burgundy bg-blush/40 shadow-soft'
                    : 'border-border hover:bg-secondary/70',
                )}
              >
                <AvatarIllustration
                  avatarType="illustration"
                  avatarValue={option.id}
                  name={option.label}
                  size="md"
                  className="mx-auto"
                />
                <p className="mt-1 text-center text-[10px] font-medium text-muted-foreground">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {avatarType === 'upload' ? (
        <div className="space-y-2">
          <Label htmlFor={`upload-${name}`}>Upload a photo</Label>
          <input
            id={`upload-${name}`}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-foreground"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  onChange({ avatarType: 'upload', avatarValue: reader.result })
                }
              }
              reader.readAsDataURL(file)
            }}
          />
          <p className="text-xs text-muted-foreground">Stored locally in your browser for this demo—no cloud upload.</p>
        </div>
      ) : null}
    </div>
  )
}
