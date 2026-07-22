import { Pencil, Trash2 } from 'lucide-react'
import type { PlanningTask } from '@/types'
import { formatDate, priorityLabel, statusLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface TimelineSectionProps {
  phase: string
  tasks: PlanningTask[]
  onToggle: (id: string) => void
  onEdit: (task: PlanningTask) => void
  onDelete: (task: PlanningTask) => void
}

export function TimelineSection({ phase, tasks, onToggle, onEdit, onDelete }: TimelineSectionProps) {
  if (tasks.length === 0) return null

  return (
    <section className="relative pl-6">
      <div className="absolute bottom-0 left-[9px] top-2 w-px bg-border" />
      <div className="absolute left-0 top-2 h-[18px] w-[18px] rounded-full border-4 border-blush bg-burgundy" />
      <h2 className="font-display text-2xl font-semibold">{phase}</h2>
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft transition-all hover:shadow-card"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggle(task.id)}
                  aria-label={`Mark ${task.title} complete`}
                  className="mt-1"
                />
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{task.category}</Badge>
                    <Badge variant="outline">{statusLabel(task.status)}</Badge>
                    <Badge variant="rose">{priorityLabel(task.priority)}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recommended: {formatDate(task.recommendedDate)}
                  </p>
                  {task.note ? <p className="mt-1 text-sm text-muted-foreground">{task.note}</p> : null}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                  <Pencil /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(task)}>
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
