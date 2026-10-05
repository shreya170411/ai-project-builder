import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Registration } from "@/components/Registration";
import { trackEvent } from "@/lib/campaign.functions";
import { getSessionId } from "@/lib/session";

const TITLE = "Build Your First AI Project in 60 Minutes — Free Workshop (Prototype)";
const DESC = "Free online, hands-on workshop for final-year engineering students: build an AI Resume Analyzer from resume upload to skill-gap recommendations. Simulation prototype.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const PIPELINE = ["Resume PDF", "Text Extraction", "AI Analysis", "Skill Detection", "Job Matching", "Skill Gap Report", "Recommendations"];
const ROADMAP = [
  ["00–05", "Understand the problem"],
  ["05–15", "Set up the project"],
  ["15–30", "Build resume extraction + AI analysis"],
  ["30–45", "Add job-role comparison and skill-gap analysis"],
  ["45–55", "Create the results interface"],
  ["55–60", "Test and deploy"],
];
const STACK = ["Python", "FastAPI", "LLM API", "HTML/CSS/JavaScript", "PDF text extraction", "Git/GitHub", "Cloud deployment"];
const WHY = [
  ["Build", "Create a real working AI application."],
  ["Learn", "Understand an end-to-end AI workflow."],
  ["Showcase", "Have a project you can discuss in interviews."],
  ["Upskill", "Learn how AI can automate repetitive career tasks."],
];
const FIT = ["want practical AI experience", "want portfolio projects", "are preparing for placements", "want to understand AI workflows", "want to build faster using AI"];
const PREREQ = [
  ["AI experience", "Beginner-friendly"],
  ["Coding", "Basic programming"],
  ["Laptop", "Required"],
  ["Format", "Online"],
  ["Duration", "60 min"],
  ["Cost", "FREE"],
];

function Chip({ children, tone = "muted" }: { children: React.ReactNode; tone?: "primary" | "accent" | "muted" }) {
  const c = tone === "primary" ? "bg-primary/15 text-primary" : tone === "accent" ? "bg-accent/15 text-accent" : "bg-tile text-muted-foreground";
  return <span className={`rounded-md px-2 py-1 ${c}`}>{children}</span>;
}

function Index() {
  const track = useServerFn(trackEvent);
  useEffect(() => {
    track({ data: { name: "landing_view", session: getSessionId() } }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-[40%] -right-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[140px]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.04]" />

      <header className="sticky top-0 z-30 border-b border-line/10 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="font-display text-sm font-bold tracking-tight">AI·RESUME<span className="text-primary">LAB</span></div>
          <span className="hidden rounded-full border border-line/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:inline">
            Simulation / Growth Challenge Prototype
          </span>
          <a href="#register" className="rounded-md bg-primary px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-primary-foreground">Register</a>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-5 sm:pt-10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <section className="bento animate-rise relative overflow-hidden p-6 md:col-span-12 md:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
              <div className="animate-sweep h-px w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <div className="mb-4 inline-block rounded-full border border-accent/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent sm:hidden">
              Simulation / Growth Challenge Prototype
            </div>
            <div className="eyebrow mb-4 text-[11px]">Free online workshop · for final-year engineering students</div>
            <h1 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl">
              Build Your First AI Project in 60 Minutes
            </h1>
            <p className="mt-4 max-w-[52ch] text-base text-muted-foreground text-pretty md:text-lg">
              Turn a real career problem into a working AI-powered solution — from resume upload to personalized skill-gap recommendations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">Free</span>
              {["Online", "60 Minutes", "Hands-On"].map((b) => (
                <span key={b} className="rounded-md border border-line/15 px-2.5 py-1 text-muted-foreground">{b}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#register" className="rounded-lg bg-primary px-5 py-3 text-center font-display text-sm font-semibold text-primary-foreground ring-1 ring-primary/40 transition-colors hover:bg-primary/90">
                REGISTER FREE
              </a>
              <a href="#build" className="rounded-lg border border-line/15 px-5 py-3 text-center font-display text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary">
                SEE WHAT YOU'LL BUILD
              </a>
            </div>
          </section>

          <section id="build" className="bento animate-rise scroll-mt-20 p-5 md:col-span-7 md:p-6 [animation-delay:80ms]">
            <div className="eyebrow mb-4">Proposed workshop project · AI Resume Analyzer</div>
            <h2 className="font-display text-xl font-bold tracking-tight">What will you actually build?</h2>
            <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
              {PIPELINE.map((p, i) => (
                <span key={p} className="contents">
                  <Chip tone={i === 0 ? "primary" : i === 5 ? "accent" : "muted"}>{p}</Chip>
                  {i < PIPELINE.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-line/10 bg-background/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Mock result</span>
                <span className="font-mono text-[11px] text-primary">Target · Data Analyst</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Detected skills</div>
                  <div className="flex flex-wrap gap-1 text-[11px]">{["Python", "SQL", "Excel", "Pandas"].map((s) => <span key={s} className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{s}</span>)}</div>
                </div>
                <div>
                  <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Potential gaps</div>
                  <div className="flex flex-wrap gap-1 text-[11px]">{["Power BI", "Statistics", "Data Visualization"].map((s) => <span key={s} className="rounded bg-accent/15 px-1.5 py-0.5 text-accent">{s}</span>)}</div>
                </div>
                <div>
                  <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Recommendations</div>
                  <ul className="space-y-1 text-[11px] text-muted-foreground">
                    {["Add a measurable SQL project", "Add Power BI experience", "Highlight analytical outcomes", "Strengthen statistics knowledge"].map((r) => (
                      <li key={r} className="flex gap-1.5"><span className="text-primary">·</span>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/70">Proposed workshop project — illustrative output, not an official NxtWave curriculum.</p>
          </section>

          <section className="bento animate-rise p-5 md:col-span-5 md:p-6 [animation-delay:160ms]">
            <div className="eyebrow mb-4">Proposed simulation workflow</div>
            <h2 className="mb-4 font-display text-xl font-bold tracking-tight">60-minute build roadmap</h2>
            <div className="relative space-y-3.5 border-l border-line/15 pl-4">
              {ROADMAP.map(([t, l], i) => (
                <div key={t} className="group relative">
                  <span className={`absolute -left-[21px] top-1 size-2 rounded-full transition-transform group-hover:scale-150 ${i === 5 ? "bg-accent" : i === 0 ? "bg-primary" : "bg-primary/60"}`} />
                  <div className={`font-mono text-[10px] ${i === 5 ? "text-accent" : "text-primary"}`}>{t} min</div>
                  <div className="text-sm">{l}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bento animate-rise p-5 md:col-span-4 md:p-6 [animation-delay:220ms]">
            <div className="eyebrow mb-3">Proposed workshop technology stack</div>
            <h2 className="mb-4 font-display text-lg font-bold tracking-tight">What you'll work with</h2>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {STACK.map((s, i) => <Chip key={s} tone={i < 3 ? "primary" : "muted"}>{s}</Chip>)}
              <span className="rounded-md border border-accent/30 px-2 py-1 text-accent">n8n automation (optional, advanced)</span>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/70">Not confirmed by NxtWave — tools are TBD.</p>
          </section>

          <section className="bento animate-rise p-5 md:col-span-8 md:p-6 [animation-delay:280ms]">
            <div className="eyebrow mb-3">Why this matters</div>
            <h2 className="mb-4 font-display text-lg font-bold tracking-tight text-balance">
              Don't just learn another AI tool. Build something you can understand, explain and extend.
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {WHY.map(([t, d]) => (
                <div key={t} className="rounded-xl border border-line/10 bg-background/50 p-3.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-primary">{t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bento animate-rise p-5 md:col-span-5 md:p-6 [animation-delay:340ms]">
            <div className="eyebrow mb-3">Who is this for</div>
            <h2 className="mb-3 font-display text-lg font-bold tracking-tight">Final-year engineering students</h2>
            <div className="mb-2 text-xs text-muted-foreground">Good fit if you:</div>
            <ul className="space-y-1 text-sm">
              {FIT.map((f) => <li key={f} className="flex gap-2"><span className="text-primary">✓</span>{f}</li>)}
            </ul>
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 font-mono text-[11px] sm:grid-cols-2">
              {PREREQ.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line/10 pb-1">
                  <span className="text-muted-foreground">{k}</span>
                  <span className={v === "FREE" ? "text-primary" : ""}>{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/70">Proposed campaign details.</p>

            <div className="mt-6 border-t border-line/10 pt-5">
              <div className="eyebrow mb-3">Workshop details</div>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Date</dt><dd>Saturday, 17 October 2026</dd>
                <dt className="text-muted-foreground">Time</dt><dd>6:00 PM IST</dd>
                <dt className="text-muted-foreground">Duration</dt><dd>60 minutes</dd>
                <dt className="text-muted-foreground">Format</dt><dd>Online</dd>
                <dt className="text-muted-foreground">Fee</dt><dd className="text-primary">FREE</dd>
              </dl>
              <p className="mt-3 text-[10px] text-muted-foreground/70">All workshop logistics shown here are simulated for the Growth Challenge prototype.</p>
            </div>
          </section>

          <section id="register" className="bento animate-rise scroll-mt-20 p-5 md:col-span-7 md:p-6 [animation-delay:400ms]">
            <div className="eyebrow mb-1">Registration</div>
            <div className="mb-4 font-mono text-[11px] text-muted-foreground">Sat, 17 Oct 2026 · 6:00 PM IST · Online · Free</div>
            <Registration />
          </section>
        </div>
      </main>

      <footer className="relative border-t border-line/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 sm:px-5 md:flex-row md:items-center">
          <div className="font-display text-sm font-bold tracking-tight">AI·RESUME<span className="text-primary">LAB</span></div>
          <p className="max-w-[52ch] font-mono text-[10px] text-muted-foreground/70">
            Simulation / Growth Challenge Prototype. Proposed workshop project and campaign details only — not an officially announced NxtWave workshop.
          </p>
          <Link to="/admin" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary">Admin dashboard →</Link>
        </div>
      </footer>
    </div>
  );
}
