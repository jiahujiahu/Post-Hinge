import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { answerAssistantPrompt, SUGGESTED_PROMPTS } from '@/lib/assistant'
import { createId } from '@/lib/utils'

export function AssistantPage() {
  const { data, addChatMessage } = useApp()
  const [searchParams] = useSearchParams()
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const askedFromQuery = useRef<string | null>(null)
  const dataRef = useRef(data)

  dataRef.current = data

  const coupleNames = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data.chatMessages, thinking])

  const ask = (prompt: string) => {
    const trimmed = prompt.trim()
    if (!trimmed || thinking) return

    addChatMessage({
      id: createId('chat'),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    })
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      const reply = answerAssistantPrompt(trimmed, dataRef.current)
      addChatMessage(reply)
      setThinking(false)
    }, 700)
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (!q || askedFromQuery.current === q) return
    askedFromQuery.current = q
    setInput(q)
    const timer = window.setTimeout(() => {
      addChatMessage({
        id: createId('chat'),
        role: 'user',
        content: q,
        createdAt: new Date().toISOString(),
      })
      setThinking(true)
      window.setTimeout(() => {
        addChatMessage(answerAssistantPrompt(q, dataRef.current))
        setThinking(false)
        setInput('')
      }, 700)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [searchParams, addChatMessage])

  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <PageHeader
        title="Wedding assistant"
        subtitle={`Ask planning questions grounded in ${coupleNames}’s wedding context in ${data.wedding.city}.`}
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-border bg-secondary/40 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="rose">Context-aware</Badge>
              <Badge variant="secondary">Demo Mode</Badge>
              <p className="text-xs text-muted-foreground">
                Benchmark prices are estimates in the demo, not verified market data.
              </p>
            </div>
            <div
              className="mt-3 flex gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Suggested questions"
            >
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={prompt}
                  id={index === 0 ? 'demo-live-band-prompt' : undefined}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-blush/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[55vh] space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            {data.chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                    message.role === 'user'
                      ? 'bg-burgundy text-primary-foreground'
                      : 'border border-border bg-card'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.contextCards?.length ? (
                    <div className="mt-3 grid gap-2">
                      {message.contextCards.map((card) => (
                        <div
                          key={`${message.id}-${card.title}`}
                          className="rounded-xl bg-secondary/80 px-3 py-2 text-foreground"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {card.title}
                          </p>
                          <p className="mt-1 text-sm">{card.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {thinking ? (
              <div className="flex justify-start" aria-live="polite">
                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-soft">
                  Reviewing your budget, vendors, and timeline…
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form
            className="flex flex-col gap-3 border-t border-border p-4 md:flex-row md:items-end"
            onSubmit={(event) => {
              event.preventDefault()
              ask(input)
            }}
          >
            <div className="min-w-0 flex-1">
              <Label htmlFor="assistant-input" className="sr-only">
                Ask the wedding assistant
              </Label>
              <Textarea
                id="assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about budget trade-offs, quote value, or what to do next…"
                className="min-h-[88px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={!input.trim() || thinking}
              onClick={() => {
                if (!input.trim()) toast.message('Type a question or choose a suggested prompt')
              }}
            >
              <Send /> Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
