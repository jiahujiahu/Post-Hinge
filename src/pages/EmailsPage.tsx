import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Copy, Mail, RefreshCw, Save, Smile, TextQuote } from 'lucide-react'
import type { EmailPurpose, EmailTone, VendorCategory } from '@/types'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { EmailPreview } from '@/components/EmailPreview'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SAMPLE_NEGOTIATION_EMAIL,
  generateEmail,
  makeEmailFriendlier,
  makeEmailShorter,
} from '@/lib/emailGenerator'
import { copyText } from '@/lib/clipboard'
import { formatDate } from '@/lib/utils'

const purposes: EmailPurpose[] = [
  'Initial inquiry',
  'Follow-up',
  'Quote negotiation',
  'Decline vendor',
  'Confirm booking',
  'Request contract clarification',
]

const tones: EmailTone[] = [
  'Warm and friendly',
  'Professional',
  'Concise',
  'Firm but polite',
]

const vendorTypes: VendorCategory[] = [
  'Photography',
  'Catering',
  'Venue',
  'Flowers',
  'Music',
  'Fashion',
  'Stationery',
  'Transportation',
  'Miscellaneous',
]

export function EmailsPage() {
  const { data, addEmailDraft } = useApp()
  const [searchParams] = useSearchParams()
  const [vendorType, setVendorType] = useState<VendorCategory>('Photography')
  const [vendorName, setVendorName] = useState('Northlight Photography')
  const [purpose, setPurpose] = useState<EmailPurpose>('Quote negotiation')
  const [tone, setTone] = useState<EmailTone>('Warm and friendly')
  const [budgetRange, setBudgetRange] = useState('$3,600 CAD')
  const [questions, setQuestions] = useState(
    'Can the travel fee be waived?\nCan an album be included at the quoted price?',
  )
  const [context, setContext] = useState(
    'We love the portfolio and especially value the second photographer and engagement session.',
  )
  const [subject, setSubject] = useState(SAMPLE_NEGOTIATION_EMAIL.subject)
  const [body, setBody] = useState(SAMPLE_NEGOTIATION_EMAIL.body)
  const [generating, setGenerating] = useState(false)

  const coupleNames = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`

  const buildEmail = (overrides?: {
    vendorName?: string
    purpose?: EmailPurpose
    vendorType?: VendorCategory
    tone?: EmailTone
  }) => {
    const nextVendor = overrides?.vendorName ?? vendorName
    const nextPurpose = overrides?.purpose ?? purpose
    const nextType = overrides?.vendorType ?? vendorType
    const nextTone = overrides?.tone ?? tone

    if (
      nextPurpose === 'Quote negotiation' &&
      nextVendor.toLowerCase().includes('northlight')
    ) {
      return {
        subject: SAMPLE_NEGOTIATION_EMAIL.subject,
        body: SAMPLE_NEGOTIATION_EMAIL.body.replace('Maya & Alex', coupleNames),
      }
    }

    return generateEmail({
      vendorType: nextType,
      vendorName: nextVendor,
      purpose: nextPurpose,
      tone: nextTone,
      weddingDate: formatDate(data.wedding.weddingDate),
      budgetRange,
      questions,
      context,
      coupleNames,
    })
  }

  const regenerate = (overrides?: {
    vendorName?: string
    purpose?: EmailPurpose
    vendorType?: VendorCategory
    tone?: EmailTone
  }) => {
    setGenerating(true)
    window.setTimeout(() => {
      const result = buildEmail(overrides)
      setSubject(result.subject)
      setBody(result.body)
      setGenerating(false)
      toast.success('Email ready')
    }, 450)
  }

  useEffect(() => {
    const purposeParam = searchParams.get('purpose')
    const vendorParam = searchParams.get('vendor')
    const autogen = searchParams.get('autogen') === '1'
    if (!purposeParam && !vendorParam && !autogen) return

    const nextPurpose =
      purposeParam && purposes.includes(purposeParam as EmailPurpose)
        ? (purposeParam as EmailPurpose)
        : 'Quote negotiation'
    const nextVendor = vendorParam || 'Northlight Photography'
    let nextType: VendorCategory = 'Photography'
    if (nextVendor.toLowerCase().includes('bloom')) nextType = 'Flowers'

    setPurpose(nextPurpose)
    setVendorName(nextVendor)
    setVendorType(nextType)

    if (
      nextPurpose === 'Quote negotiation' &&
      nextVendor.toLowerCase().includes('northlight')
    ) {
      setSubject(SAMPLE_NEGOTIATION_EMAIL.subject)
      setBody(SAMPLE_NEGOTIATION_EMAIL.body.replace('Maya & Alex', coupleNames))
      return
    }

    const result = generateEmail({
      vendorType: nextType,
      vendorName: nextVendor,
      purpose: nextPurpose,
      tone: 'Warm and friendly',
      weddingDate: formatDate(data.wedding.weddingDate),
      budgetRange: '$3,600 CAD',
      questions:
        'Can the travel fee be waived?\nCan an album be included at the quoted price?',
      context:
        'We love the portfolio and especially value the second photographer and engagement session.',
      coupleNames,
    })
    setSubject(result.subject)
    setBody(result.body)
  }, [searchParams, coupleNames, data.wedding.weddingDate])

  return (
    <div>
      <PageHeader
        title="AI vendor email generator"
        subtitle="Draft polished inquiry, follow-up, and negotiation emails using your wedding context."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Email inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email-vendor-type">Vendor type</Label>
                <Select
                  value={vendorType}
                  onValueChange={(value) => setVendorType(value as VendorCategory)}
                >
                  <SelectTrigger id="email-vendor-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor name</Label>
                <Input
                  id="vendorName"
                  value={vendorName}
                  onChange={(event) => setVendorName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-purpose">Email purpose</Label>
                <Select value={purpose} onValueChange={(value) => setPurpose(value as EmailPurpose)}>
                  <SelectTrigger id="email-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {purposes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-tone">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as EmailTone)}>
                  <SelectTrigger id="email-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wedding-date-display">Wedding date</Label>
                <Input id="wedding-date-display" value={formatDate(data.wedding.weddingDate)} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget range</Label>
                <Input
                  id="budgetRange"
                  value={budgetRange}
                  onChange={(event) => setBudgetRange(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">Important questions</Label>
              <Textarea
                id="questions"
                value={questions}
                onChange={(event) => setQuestions(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Additional context</Label>
              <Textarea
                id="context"
                value={context}
                onChange={(event) => setContext(event.target.value)}
              />
            </div>
            <Button className="w-full" onClick={() => regenerate()} disabled={generating}>
              {generating ? 'Generating…' : 'Generate email'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {generating ? (
            <Card>
              <CardContent className="space-y-3 p-6" aria-live="polite">
                <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-full animate-pulse rounded bg-secondary" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-10/12 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-9/12 animate-pulse rounded bg-secondary" />
                <p className="text-sm text-muted-foreground">Drafting a polished vendor email…</p>
              </CardContent>
            </Card>
          ) : (
            <EmailPreview subject={subject} body={body} />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={generating}
              onClick={async () => {
                const ok = await copyText(`Subject: ${subject}\n\n${body}`)
                if (ok) toast.success('Email copied')
                else toast.error('Could not copy email')
              }}
            >
              <Copy /> Copy email
            </Button>
            <Button variant="outline" onClick={() => regenerate()} disabled={generating}>
              <RefreshCw className={generating ? 'animate-spin' : ''} /> Regenerate
            </Button>
            <Button
              variant="outline"
              disabled={generating}
              onClick={() => {
                setBody(makeEmailFriendlier(body))
                toast.success('Made friendlier')
              }}
            >
              <Smile /> Make friendlier
            </Button>
            <Button
              variant="outline"
              disabled={generating}
              onClick={() => {
                setBody(makeEmailShorter(body))
                toast.success('Made shorter')
              }}
            >
              <TextQuote /> Make shorter
            </Button>
            <Button
              disabled={generating}
              onClick={() => {
                addEmailDraft({
                  vendorType,
                  vendorName,
                  purpose,
                  tone,
                  subject,
                  body,
                })
                toast.success('Draft saved')
              }}
            >
              <Save /> Save draft
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-2xl font-semibold">Saved drafts</h2>
        {data.emailDrafts.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No drafts yet"
            description="Generate an email and save it to keep negotiation language ready for your vendors."
            actionLabel="Generate email"
            onAction={() => regenerate()}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.emailDrafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{draft.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {draft.vendorName} · {draft.purpose} · {draft.tone}
                  </p>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                    {draft.body}
                  </pre>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      setSubject(draft.subject)
                      setBody(draft.body)
                      setVendorName(draft.vendorName)
                      setVendorType(draft.vendorType)
                      setPurpose(draft.purpose)
                      setTone(draft.tone)
                      toast.message('Draft loaded into preview')
                    }}
                  >
                    Load into editor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
