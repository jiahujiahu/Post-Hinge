import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmailPreviewProps {
  subject: string
  body: string
}

export function EmailPreview({ subject, body }: EmailPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Email preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Subject: <span className="font-medium text-foreground">{subject || 'Untitled draft'}</span>
        </p>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap rounded-2xl bg-secondary/50 p-4 font-sans text-sm leading-relaxed text-foreground">
          {body || 'Generate an email to preview your vendor message here.'}
        </pre>
      </CardContent>
    </Card>
  )
}
