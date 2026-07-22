import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { answerAssistantPrompt, SUGGESTED_PROMPTS } from '@/lib/assistant'
import { createId } from '@/lib/utils'

export function AssistantPage() {
  const { data, addChatMessage } = useApp()
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
      const reply = answerAssistantPrompt(trimmed, data)
      addChatMessage(reply)
      setThinking(false)
    }, 700)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <PageHeader
        title="Wedding assistant"
        subtitle="Ask planning questions grounded in Maya & Alex’s sample wedding context."
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
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-blush/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <div className="flex justify-start">
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
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about budget trade-offs, quote value, or what to do next…"
              className="min-h-[88px] flex-1"
            />
            <Button
              type="submit"
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
