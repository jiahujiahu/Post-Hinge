import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, RefreshCw } from 'lucide-react'
import type { PlanningTask, Priority, TaskStatus, TimelinePhase } from '@/types'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/PageHeader'
import { TimelineSection } from '@/components/TimelineSection'
import { EmptyState } from '@/components/EmptyState'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createId } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

const phases: TimelinePhase[] = [
  '12+ months before',
  '9–12 months before',
  '6–9 months before',
  '3–6 months before',
  '1–3 months before',
  'Final month',
  'Wedding week',
]

type Filter = 'all' | 'upcoming' | 'completed' | 'at_risk'

const emptyTask = (): PlanningTask => ({
  id: createId('task'),
  title: '',
  category: 'Planning',
  phase: '6–9 months before',
  recommendedDate: new Date().toISOString().slice(0, 10),
  status: 'upcoming',
  priority: 'medium',
  note: '',
  completed: false,
})

export function TimelinePage() {
  const { data, upsertTask, deleteTask, toggleTaskComplete, setTasks } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [regenerating, setRegenerating] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draft, setDraft] = useState<PlanningTask>(emptyTask())
  const [deleteTarget, setDeleteTarget] = useState<PlanningTask | null>(null)

  const filtered = useMemo(() => {
    return data.tasks.filter((task) => {
      if (filter === 'all') return true
      if (filter === 'completed') return task.completed
      if (filter === 'at_risk') return task.status === 'at_risk'
      return !task.completed && task.status !== 'completed'
    })
  }, [data.tasks, filter])

  const regenerate = () => {
    setRegenerating(true)
    window.setTimeout(() => {
      const refreshed = data.tasks.map((task) =>
        task.completed
          ? task
          : {
              ...task,
              note: task.note || `Updated for ${data.wedding.guestCount} guests in ${data.wedding.city}.`,
            },
      )
      setTasks(refreshed)
      setRegenerating(false)
      toast.success('Timeline updated based on wedding date, guest count, and completed tasks')
    }, 1200)
  }

  return (
    <div>
      <PageHeader
        title="Wedding timeline"
        subtitle="A phase-by-phase plan from 12+ months out through wedding week."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDraft(emptyTask())
                setEditorOpen(true)
              }}
            >
              <Plus /> Add task
            </Button>
            <Button onClick={regenerate} disabled={regenerating}>
              <RefreshCw className={regenerating ? 'animate-spin' : ''} />
              {regenerating ? 'Regenerating…' : 'Regenerate timeline'}
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['all', 'All tasks'],
            ['upcoming', 'Upcoming'],
            ['completed', 'Completed'],
            ['at_risk', 'At risk'],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'default' : 'outline'}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No tasks in this view"
          description="Try another filter, or add a custom task to keep your plan moving."
          actionLabel="Add task"
          onAction={() => {
            setDraft(emptyTask())
            setEditorOpen(true)
          }}
        />
      ) : (
        <div className="space-y-10">
          {phases.map((phase) => (
            <TimelineSection
              key={phase}
              phase={phase}
              tasks={filtered.filter((task) => task.phase === phase)}
              onToggle={toggleTaskComplete}
              onEdit={(task) => {
                setDraft(task)
                setEditorOpen(true)
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.tasks.some((task) => task.id === draft.id) ? 'Edit task' : 'Add custom task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Task title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    setDraft((current) => ({ ...current, category: value as PlanningTask['category'] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Planning', 'Guests', 'Attire', 'Photography', 'Catering', 'Venue', 'Flowers', 'Music', 'Stationery', 'Transportation'].map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phase</Label>
                <Select
                  value={draft.phase}
                  onValueChange={(value) => setDraft((current) => ({ ...current, phase: value as TimelinePhase }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendedDate">Recommended date</Label>
                <Input
                  id="recommendedDate"
                  type="date"
                  value={draft.recommendedDate}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, recommendedDate: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={draft.priority}
                  onValueChange={(value) => setDraft((current) => ({ ...current, priority: value as Priority }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(value) => setDraft((current) => ({ ...current, status: value as TaskStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="at_risk">At risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Optional note</Label>
              <Textarea
                id="note"
                value={draft.note || ''}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!draft.title.trim()) {
                  toast.error('Task title is required')
                  return
                }
                upsertTask({
                  ...draft,
                  completed: draft.status === 'completed',
                })
                setEditorOpen(false)
                toast.success('Task saved')
              }}
            >
              Save task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this task?"
        description="This removes the task from your wedding timeline. You can add it again later."
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteTask(deleteTarget.id)
          toast.success('Task deleted')
        }}
      />
    </div>
  )
}
