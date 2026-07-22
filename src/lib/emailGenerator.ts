import type { EmailPurpose, EmailTone, VendorCategory } from '@/types'

interface EmailInput {
  vendorType: VendorCategory
  vendorName: string
  purpose: EmailPurpose
  tone: EmailTone
  weddingDate: string
  budgetRange: string
  questions: string
  context: string
  coupleNames: string
}

function toneIntro(tone: EmailTone, vendorName: string) {
  switch (tone) {
    case 'Warm and friendly':
      return `Hi there,\n\nThank you for taking the time to share details about ${vendorName}. We truly appreciate your work and are excited about the possibility of collaborating.`
    case 'Concise':
      return `Hello,\n\nThank you for the ${vendorName} details. We have a few quick questions before deciding.`
    case 'Firm but polite':
      return `Hello,\n\nThank you for the proposal from ${vendorName}. We want to be clear about our constraints while exploring whether we can move forward.`
    default:
      return `Hello,\n\nThank you for sharing the ${vendorName} proposal. We are reviewing options carefully for our wedding.`
  }
}

function purposeBody(input: EmailInput) {
  const questions = input.questions.trim()
    ? `\n\nSpecifically, we would like to know:\n${input.questions
        .split('\n')
        .filter(Boolean)
        .map((line) => `• ${line.replace(/^[-•]\s*/, '')}`)
        .join('\n')}`
    : ''

  const context = input.context.trim() ? `\n\nAdditional context: ${input.context.trim()}` : ''

  switch (input.purpose) {
    case 'Initial inquiry':
      return `We are planning our wedding for ${input.weddingDate} and are currently looking for ${input.vendorType.toLowerCase()} services. Our budget range for this category is approximately ${input.budgetRange}.${questions}${context}\n\nCould you share package options, availability, and next steps?`
    case 'Follow-up':
      return `We wanted to follow up on our previous note regarding ${input.vendorType.toLowerCase()} services for our ${input.weddingDate} wedding.${questions}${context}\n\nWe would appreciate an update when you have a moment.`
    case 'Quote negotiation':
      return `We really like what ${input.vendorName} offers and can see how it would elevate our day. Before moving forward, we wanted to ask whether there is flexibility around the quoted package. We are currently working within a budget of approximately ${input.budgetRange}.${questions}${context}\n\nWe would be happy to discuss options that could work for both sides.`
    case 'Decline vendor':
      return `After careful consideration, we have decided to move forward with another option for ${input.vendorType.toLowerCase()}. We sincerely appreciate the time you spent preparing details for us.${context}\n\nWe wish you all the best with your upcoming weddings.`
    case 'Confirm booking':
      return `We are delighted to confirm that we would like to book ${input.vendorName} for our wedding on ${input.weddingDate}.${questions}${context}\n\nPlease let us know the next steps for contracts and deposits.`
    case 'Request contract clarification':
      return `Before we sign, we would appreciate clarification on a few contract details for ${input.vendorName}.${questions}${context}\n\nOnce those points are clear, we should be ready to proceed.`
  }
}

export function generateEmail(input: EmailInput) {
  const subjectMap: Record<EmailPurpose, string> = {
    'Initial inquiry': `${input.vendorType} inquiry for ${input.weddingDate}`,
    'Follow-up': `Follow-up on ${input.vendorType.toLowerCase()} availability`,
    'Quote negotiation': `Follow-up on ${input.vendorType.toLowerCase()} package`,
    'Decline vendor': `Thank you — update on our ${input.vendorType.toLowerCase()} search`,
    'Confirm booking': `Confirming our booking with ${input.vendorName}`,
    'Request contract clarification': `Quick contract questions for ${input.vendorName}`,
  }

  const body = `${toneIntro(input.tone, input.vendorName)}

${purposeBody(input)}

Best,
${input.coupleNames}`

  return {
    subject: subjectMap[input.purpose],
    body,
  }
}

export function makeEmailFriendlier(body: string) {
  return body
    .replace('We want to be clear about our constraints', 'We wanted to share a bit about our planning priorities')
    .replace('Hello,', 'Hi there,')
    .replace('Thank you for the proposal', 'Thank you so much for the thoughtful proposal')
}

export function makeEmailShorter(body: string) {
  const lines = body.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length <= 6) return body
  const greeting = lines[0]
  const closing = lines.slice(-2).join('\n')
  const middle = lines.slice(1, -2).join(' ')
  const shortened = middle.length > 280 ? `${middle.slice(0, 280).trim()}…` : middle
  return `${greeting}\n\n${shortened}\n\n${closing}`
}

export const SAMPLE_NEGOTIATION_EMAIL = {
  subject: 'Follow-up on photography package',
  body: `Hi Sarah,

Thank you for sharing the details of the Northlight Photography package. We really love your portfolio, and the engagement session and second photographer would be valuable additions for our wedding.

Before moving forward, we wanted to ask whether there is any flexibility in the package price. We are currently working within a photography budget of approximately $3,600 CAD. Would it be possible to waive the travel fee or include a wedding album at the current quoted price?

We would be happy to discuss options that could work for both sides.

Best,
Maya & Alex`,
}
