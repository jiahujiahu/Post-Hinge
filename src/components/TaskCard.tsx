import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { PlanningTask } from '@/types'
import { formatDate, priorityLabel, statusLabel } from '@/lib/utils'

interface TaskCardProps {
  task: PlanningTask
  onToggle: (id: string) => void
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft transition-all hover:shadow-card">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} complete`}
          className="mt-1"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
              {task.title}
            </h3>
            <Badge variant="secondary">{task.category}</Badge>
            {task.personalizedLabel ? (
              <Badge variant="outline" className="border-champagne/80 bg-champagne/20 text-burgundy">
                {task.personalizedLabel}
              </Badge>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Due {formatDate(task.dueDate || task.recommendedDate)}</span>
            <span>•</span>
            <span>{priorityLabel(task.priority)} priority</span>
            <span>•</span>
            <span>{statusLabel(task.status)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
