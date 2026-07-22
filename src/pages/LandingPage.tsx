import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarRange,
  ChartColumnIncreasing,
  Check,
  Mail,
  Sparkles,
  Store,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    title: 'Personalized timeline',
    description: 'A phase-by-phase plan that adapts to your wedding date, guest count, and what’s already done.',
    icon: CalendarRange,
  },
  {
    title: 'Vendor quote analysis',
    description: 'Upload quotes, surface hidden fees, and compare packages before you commit.',
    icon: Store,
  },
  {
    title: 'Smart budget forecasting',
    description: 'Track spent, committed, and projected final spend with clear category risk signals.',
    icon: ChartColumnIncreasing,
  },
  {
    title: 'AI-generated vendor communication',
    description: 'Draft inquiry, follow-up, and negotiation emails that sound like you—not a template bot.',
    icon: Mail,
  },
]

const traditional = [
  'Expensive planner',
  'Multiple spreadsheets',
  'Scattered emails',
  'Unclear vendor pricing',
  'Missed deadlines',
]

const afterHinge = [
  'One personalized dashboard',
  'Budget alerts',
  'Quote comparisons',
  'Weekly action plan',
  'AI-assisted decisions',
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-burgundy font-display text-lg font-bold text-primary-foreground">
            A
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold leading-none">AfterHinge</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              The AI copilot for everything after “We matched.”
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Demo Mode
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">View demo</Link>
          </Button>
        </div>
      </header>

      <section className="gradient-hero relative overflow-hidden border-b border-border/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            <p className="font-display text-5xl font-semibold leading-[0.95] text-burgundy md:text-6xl lg:text-7xl">
              AfterHinge
            </p>
            <h1 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              Hinge helped you meet. We help you get married.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              AfterHinge turns your wedding date, budget, and vendor quotes into a personalized plan—so you can make
              confident decisions without hiring a full-service planner.
            </p>
            <p className="mt-3 text-sm font-medium text-burgundy">
              Plan your wedding without hiring a $5,000 wedding planner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/onboarding">
                  Plan our wedding <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View demo</Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-in fade-in-0 zoom-in-95 duration-700 delay-150">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blush/70 via-champagne/40 to-transparent blur-2xl" />
            <Card className="relative overflow-hidden border-champagne/60 bg-card/95">
              <CardContent className="p-5 md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Dashboard preview
                    </p>
                    <p className="font-display text-2xl font-semibold">Maya & Alex</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="rose">Wild Adventurers</Badge>
                    <Badge variant="secondary">184 days to go</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Budget left', '$13,850'],
                    ['Tasks done', '2 / 19'],
                    ['Vendors booked', '1'],
                    ['At risk', '3 items'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-secondary/80 p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-burgundy px-4 py-3 text-primary-foreground">
                  <p className="text-sm font-semibold">This week</p>
                  <p className="mt-1 text-sm text-primary-foreground/85">
                    Review photographer quotes · Confirm floral consult · Finalize guest list
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Three steps to a clearer plan</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Tell us about your wedding—and who you are.', 'Share your date, budget, couple archetype, vibes, and spending style.'],
            ['Upload quotes and organize decisions.', 'Keep vendors, packages, and trade-offs in one place.'],
            ['Get a plan that feels like you.', 'Timeline, budget, vendor advice, and emails adapt to your relationship.'],
          ].map(([title, body], index) => (
            <Card key={title} className="transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display text-xl font-semibold text-burgundy">
                  {index + 1}
                </div>
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/50 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">Capabilities</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Built for confident decisions</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-all hover:shadow-card">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-burgundy">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">Personalization</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Not every couple wants the same wedding.
          </h2>
          <p className="mt-3 text-muted-foreground">
            AfterHinge learns what you value, how you spend, and how you want the day to feel. Your timeline,
            budget, vendor recommendations, and emails adapt to your relationship—not a generic checklist.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              name: 'Wild Adventurers',
              copy: 'Experiences over perfect place settings. Outdoor ceremonies, travel, and photography rise.',
              tags: ['Travel', 'Outdoor', 'Experiences'],
            },
            {
              name: 'Joyful and Budget-Smart',
              copy: 'Beautiful and meaningful without spending just because tradition says so.',
              tags: ['Practical', 'Value', 'DIY-friendly'],
            },
            {
              name: 'Elegant Traditionalists',
              copy: 'Timeless details, meaningful traditions, and a polished guest experience.',
              tags: ['Classic', 'Formal', 'Etiquette'],
            },
          ].map((profile) => (
            <Card key={profile.name} className="transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <Badge variant="rose">{profile.name}</Badge>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profile.copy}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {profile.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-burgundy/15 bg-gradient-to-br from-card to-champagne/20">
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
                Same photographer quote
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">Northlight Photography · $4,200</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Advice changes with the couple profile—not a one-size-fits-all warning.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-blush/40 p-3 text-sm">
                <p className="font-semibold text-burgundy">Wild Adventurers</p>
                <p className="mt-1 text-muted-foreground">
                  Above benchmark, but photography is a top priority—possible fit if travel fees are waived.
                </p>
              </div>
              <div className="rounded-xl bg-secondary/80 p-3 text-sm">
                <p className="font-semibold">Joyful and Budget-Smart</p>
                <p className="mt-1 text-muted-foreground">
                  Exceeds category target and local range—compare alternatives before committing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">Why couples switch</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Traditional wedding planning vs AfterHinge</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-2xl font-semibold">Traditional wedding planning</h3>
              <ul className="mt-4 space-y-3">
                {traditional.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 text-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-burgundy/20 bg-gradient-to-br from-card to-blush/30">
            <CardContent className="p-6">
              <h3 className="font-display text-2xl font-semibold text-burgundy">AfterHinge</h3>
              <ul className="mt-4 space-y-3">
                {afterHinge.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-burgundy px-6 py-12 text-primary-foreground md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                <Sparkles className="h-3.5 w-3.5" /> Ready for your demo
              </div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Start with a sample couple—or plan your own wedding in minutes.
              </h2>
              <p className="mt-3 text-primary-foreground/85">
                Explore Maya & Alex’s dashboard, analyze a photographer quote, and generate a negotiation email in one click.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="champagne">
                <Link to="/onboarding">Plan our wedding</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/dashboard">View demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-display text-xl text-foreground">AfterHinge</p>
          <p>The AI copilot for everything after “We matched.”</p>
          <p>Hackathon MVP · Demo Mode · No backend required</p>
        </div>
      </footer>
    </div>
  )
}
