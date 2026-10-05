import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Upload, FileText, Brain, Target, GitCompare, FileBarChart, Lightbulb, Menu, X, Check,
  MessageSquare, Map, Code2, Play, Bug, GraduationCap,
} from "lucide-react";
import { Registration } from "@/components/Registration";
import { trackEvent } from "@/lib/campaign.functions";
import { getSessionId } from "@/lib/session";

const TITLE = "Build Your First AI Project in 60 Minutes — NxtWave Growth Challenge Prototype";
const DESC = "Free 60-minute online workshop concept for final-year engineering students: learn an AI-building workflow and build an AI Resume Analyzer. Growth Challenge prototype.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PIPELINE = [
  [Upload, "Upload Resume", "Drop in a PDF resume."],
  [FileText, "Extract Resume Text", "PyMuPDF turns the PDF into readable text."],
  [Brain, "AI Skill Analysis", "An LLM identifies skills and summarises the profile."],
  [Target, "Select Target Role", "Pick a curated role profile, e.g. Data Analyst."],
  [GitCompare, "Compare Skills", "Match detected skills against the role's skills."],
  [FileBarChart, "Generate Skill-Gap Report", "See what's strong and what's missing."],
  [Lightbulb, "Get Recommendations", "Actionable next steps to close the gaps."],
] as const;

const WORKFLOW = [
  [MessageSquare, "Describe the problem"],
  [Map, "Plan the solution with AI"],
  [Code2, "Generate small pieces of code"],
  [Play, "Run and test"],
  [Bug, "Debug with AI"],
  [GraduationCap, "Understand and improve what you built"],
] as const;

const LEAVE = [
  "A working AI Resume Analyzer prototype",
  "A Python-based AI project",
  "A personalized skill-gap report",
  "A project you can save and showcase on GitHub",
  "A foundation you can extend after the workshop",
];

const STACK = [
  ["Python", "Build the core AI application."],
  ["VS Code", "Write, run and test your Python project."],
  ["Streamlit", "Turn your Python code into a simple interactive web app."],
  ["LLM API", "Analyze resume content and generate recommendations."],
  ["PyMuPDF", "Extract readable text from uploaded PDF resumes."],
  ["Git/GitHub", "Save and showcase your project."],
];

const ROADMAP = [
  ["00–05", "Understand the problem", "Identify what makes a resume relevant to a target role."],
  ["05–10", "Set up the project", "Open the starter project and prepare the Python environment."],
  ["10–20", "Read a resume", "Upload a PDF and extract its text."],
  ["20–35", "Add AI analysis", "Use an LLM to identify skills and summarize the candidate profile."],
  ["35–45", "Match a job role", "Compare detected skills against a predefined target-role profile."],
  ["45–55", "Generate the report", "Create skill gaps and personalized recommendations."],
  ["55–60", "Run & showcase", "Test the application and save the project for further improvement."],
];

const WHY = [
  ["Build", "Create a working AI application instead of only following tutorials."],
  ["Understand", "See how PDF extraction, AI analysis and role matching fit together."],
  ["Showcase", "Save a project you can explain in interviews and extend later."],
  ["Upskill", "Learn a repeatable workflow for building with AI."],
];

const ROLE_PROFILES: Record<string, { score: number; have: string[]; gaps: string[]; recs: string[] }> = {
  "Data Analyst": {
    score: 78, have: ["Python", "SQL", "Excel", "Pandas"], gaps: ["Power BI", "Statistics", "Data Visualization"],
    recs: ["Add a measurable SQL project", "Add Power BI experience", "Highlight analytical outcomes", "Strengthen statistics knowledge"],
  },
  "Software Developer": {
    score: 64, have: ["Python", "SQL", "Git"], gaps: ["Data Structures", "REST APIs", "Unit Testing"],
    recs: ["Add a DSA practice repo", "Build a small API project", "Write tests for one project", "Describe your code contributions"],
  },
  "QA Engineer": {
    score: 58, have: ["Python", "Excel", "SQL"], gaps: ["Test Case Design", "Selenium", "Bug Reporting"],
    recs: ["Add a test-plan sample", "Try a Selenium mini-project", "Show attention-to-detail outcomes", "Learn basic CI testing"],
  },
};

const STAGES = ["Resume uploaded", "Reading resume…", "Analyzing skills…", "Comparing with role…", "Skill gaps found", "Recommendations ready ✓"];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Section({ id, eyebrow, title, sub, children }: { id?: string; eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 py-14 md:py-20">
      <div className="reveal mb-8 max-w-2xl">
        <div className="eyebrow mb-3">{eyebrow}</div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">{title}</h2>
        {sub && <p className="mt-3 text-muted-foreground text-pretty">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Analyzer({ large = false }: { large?: boolean }) {
  const [role, setRole] = useState("Data Analyst");
  const [stage, setStage] = useState(large ? 0 : STAGES.length - 1);
  const p = ROLE_PROFILES[role]!;
  const done = stage >= STAGES.length - 1;

  function run(r = role) {
    setRole(r);
    setStage(0);
  }
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setStage((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [stage, done]);

  return (
    <div className="rounded-2xl border border-line/15 bg-card/80 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-line/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-accent/60" /><span className="size-2.5 rounded-full bg-primary/60" />
        <span className="ml-3 font-mono text-[10px] text-muted-foreground">ai-resume-analyzer · streamlit</span>
      </div>
      <div className={`grid gap-4 p-4 ${large ? "md:grid-cols-5 md:p-6" : ""}`}>
        <div className={`space-y-3 ${large ? "md:col-span-2" : ""}`}>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2.5 text-sm">
            <FileText className="size-4 text-primary" /> <span className="font-mono text-xs">shreya_resume.pdf</span>
          </div>
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase text-muted-foreground">Target role</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(ROLE_PROFILES).map((r) => (
                <button key={r} type="button" onClick={() => run(r)} className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${r === role ? "border-primary bg-primary/15 text-primary" : "border-line/15 text-muted-foreground hover:border-primary/40"}`}>{r}</button>
              ))}
            </div>
          </div>
          {large && (
            <ol className="space-y-1.5 pt-1 font-mono text-[11px]">
              {STAGES.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 transition-colors ${i <= stage ? (i === STAGES.length - 1 ? "text-primary" : "text-foreground") : "text-muted-foreground/40"}`}>
                  <span className={`size-1.5 rounded-full ${i < stage || done ? "bg-primary" : i === stage ? "animate-pulse bg-accent" : "bg-line/20"}`} />
                  {s.replace("role", `${role} role`)}
                </li>
              ))}
            </ol>
          )}
          {large && <button type="button" onClick={() => run()} className="font-mono text-[11px] uppercase tracking-wider text-primary hover:underline">↻ Re-run analysis</button>}
        </div>
        <div className={`transition-opacity duration-500 ${done ? "opacity-100" : "opacity-30"} ${large ? "md:col-span-3" : ""}`}>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Match score</div>
              <div className="font-display text-4xl font-bold text-primary">{done ? p.score : "--"}%</div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">vs {role}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/10">
            {done && <div key={role} className="animate-fill h-full rounded-full bg-primary" style={{ width: `${p.score}%` }} />}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Detected skills</div>
              <div className="flex flex-wrap gap-1 text-[11px]">{p.have.map((s) => <span key={s} className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{s}</span>)}</div>
            </div>
            <div>
              <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Skills to strengthen</div>
              <div className="flex flex-wrap gap-1 text-[11px]">{p.gaps.map((s) => <span key={s} className="rounded bg-accent/15 px-1.5 py-0.5 text-accent">{s}</span>)}</div>
            </div>
          </div>
          {large && (
            <div className="mt-4">
              <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">Recommendations</div>
              <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                {p.recs.map((r) => <li key={r} className="lift flex gap-2 rounded-lg border border-line/10 bg-background/50 px-3 py-2"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" />{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NAV = [["#build", "Build"], ["#how", "How It Works"], ["#workshop", "Workshop"]] as const;

function Index() {
  const track = useServerFn(trackEvent);
  const [open, setOpen] = useState(false);
  const once = useRef(false);
  useReveal();
  useEffect(() => {
    if (once.current) return;
    once.current = true;
    track({ data: { name: "landing_view", session: getSessionId() } }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="animate-drift pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.04]" />

      <header className="sticky top-0 z-30 border-b border-line/10 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold tracking-tight">Nxt<span className="text-primary">Wave</span></span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:inline">Growth Challenge Prototype</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(([h, l]) => <a key={h} href={h} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>)}
            <a href="#register" className="rounded-md bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Register</a>
          </nav>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
        {open && (
          <nav className="border-t border-line/10 px-4 pb-4 md:hidden">
            {NAV.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-line/10 py-3 text-sm">{l}</a>)}
            <a href="#register" onClick={() => setOpen(false)} className="mt-3 block rounded-md bg-primary py-2.5 text-center font-display text-sm font-semibold text-primary-foreground">Register</a>
          </nav>
        )}
      </header>

      <main id="top" className="relative mx-auto max-w-6xl px-4 sm:px-5">
        {/* HERO */}
        <section className="grid items-center gap-10 pt-12 pb-10 md:grid-cols-2 md:pt-20">
          <div>
            <div className="eyebrow animate-rise mb-4 text-[11px]">Free online workshop · final-year engineering students</div>
            <h1 className="animate-rise font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl">
              Build Your First AI Project in 60 Minutes
            </h1>
            <p className="animate-rise mt-5 max-w-[52ch] text-base text-muted-foreground text-pretty [animation-delay:120ms] md:text-lg">
              Build an AI Resume Analyzer that reads a resume, identifies skills, compares them with a target role, and generates a personalized skill-gap report.
            </p>
            <div className="animate-rise mt-5 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider [animation-delay:200ms]">
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">Free</span>
              {["Online", "60 Minutes", "Beginner-friendly"].map((b) => <span key={b} className="rounded-md border border-line/15 px-2.5 py-1 text-muted-foreground">{b}</span>)}
            </div>
            <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:300ms] sm:flex-row">
              <a href="#register" className="rounded-lg bg-primary px-6 py-3 text-center font-display text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90">REGISTER FREE</a>
              <a href="#build" className="rounded-lg border border-line/15 px-6 py-3 text-center font-display text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary">SEE WHAT YOU'LL BUILD</a>
            </div>
          </div>
          <div className="animate-rise [animation-delay:420ms]"><Analyzer /></div>
        </section>

        {/* BUILD */}
        <Section id="build" eyebrow="The workshop project · AI Resume Analyzer" title="What will you actually build?" sub="Not just another AI demo. You'll build a simple end-to-end application that turns a resume into an actionable career report.">
          <div className="reveal"><Analyzer large /></div>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground/80">
            <span className="font-mono uppercase tracking-wider">Illustrative project output · click a role to re-run</span>
            <span>Example role profiles are curated for the prototype.</span>
          </div>
        </Section>

        {/* HOW */}
        <Section id="how" eyebrow="How it works" title="From PDF to personalised recommendations in 7 steps">
          <ol className="relative grid gap-3 md:grid-cols-7">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 md:block" />
            {PIPELINE.map(([Icon, t, d], i) => (
              <li key={t} className="reveal group relative" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="lift h-full rounded-xl border border-line/10 bg-card/70 p-4">
                  <div className="relative mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="size-5" /></div>
                  <div className="font-mono text-[10px] text-primary">{String(i + 1).padStart(2, "0")}</div>
                  <div className="text-sm font-semibold leading-snug">{t}</div>
                  <p className="mt-1 text-xs text-muted-foreground md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-300 md:group-hover:max-h-24 md:group-hover:opacity-100">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* WORKFLOW */}
        <section className="py-14 md:py-20">
          <div className="reveal rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/60 to-accent/5 p-6 md:p-12">
            <div className="eyebrow mb-3">The AI build workflow · "Can't I just ask ChatGPT?"</div>
            <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">Don't just ask AI for code. Learn a workflow for building with AI.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WORKFLOW.map(([Icon, t], i) => (
                <div key={t} className="reveal lift flex items-center gap-4 rounded-xl border border-line/10 bg-background/60 p-4" style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className="font-display text-2xl font-bold text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="size-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-muted-foreground">The goal isn't to blindly copy code. You'll learn how to use AI as a building partner while understanding what each part of your project does.</p>
          </div>
        </section>

        {/* LEAVE WITH */}
        <Section eyebrow="Outcomes" title="By the end of 60 minutes, you'll have:">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {LEAVE.map((l, i) => (
              <div key={l} className="reveal lift rounded-xl border border-line/10 bg-card/70 p-5" style={{ transitionDelay: `${i * 60}ms` }}>
                <Check className="mb-3 size-5 text-primary" />
                <div className="text-sm font-medium">{l}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* STACK + ROADMAP */}
        <Section id="workshop" eyebrow="The workshop" title="Beginner-friendly tools, a realistic 60-minute plan">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="reveal rounded-2xl border border-line/10 bg-card/70 p-5 md:p-6">
              <h3 className="mb-4 font-display text-lg font-bold">Core tools</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {STACK.map(([t, d]) => (
                  <div key={t} className="lift rounded-lg border border-line/10 bg-background/50 p-3">
                    <div className="font-mono text-xs text-primary">{t}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-dashed border-line/15 p-3">
                <div className="eyebrow mb-2">Optional after the workshop</div>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["Cloud deployment", "Advanced automation", "More job-role integrations"].map((x) => <span key={x} className="rounded-md bg-tile px-2 py-1">{x}</span>)}
                </div>
              </div>
            </div>
            <div className="reveal rounded-2xl border border-line/10 bg-card/70 p-5 md:p-6">
              <h3 className="mb-4 font-display text-lg font-bold">60-minute roadmap</h3>
              <ol className="relative space-y-4 border-l border-line/15 pl-5">
                {ROADMAP.map(([t, l, d]) => (
                  <li key={t} className="group relative">
                    <span className="absolute -left-[25px] top-1 size-2 rounded-full bg-primary transition-transform group-hover:scale-150" />
                    <div className="font-mono text-[10px] text-primary">{t} min</div>
                    <div className="text-sm font-semibold uppercase tracking-wide">{l}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] text-muted-foreground/80">Deployment can be explored as an optional next step after the workshop.</p>
            </div>
          </div>
        </Section>

        {/* WHY */}
        <Section eyebrow="Why this matters" title="Don't just learn another AI tool. Build something you can understand, explain and extend.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(([t, d], i) => (
              <div key={t} className="reveal lift rounded-xl border border-line/10 bg-card/70 p-5" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="font-mono text-xs uppercase tracking-wider text-primary">{t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* REGISTER */}
        <section className="grid gap-4 pb-20 md:grid-cols-5">
          <div className="reveal rounded-2xl border border-line/10 bg-card/70 p-5 md:col-span-2 md:p-6">
            <div className="eyebrow mb-3">Workshop details (proposed)</div>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Date</dt><dd>Sat, 17 Oct 2026</dd>
              <dt className="text-muted-foreground">Time</dt><dd>6:00 PM IST</dd>
              <dt className="text-muted-foreground">Duration</dt><dd>60 minutes</dd>
              <dt className="text-muted-foreground">Format</dt><dd>Online</dd>
              <dt className="text-muted-foreground">Prerequisites</dt><dd>Basic programming, a laptop</dd>
              <dt className="text-muted-foreground">Fee</dt><dd className="text-primary">FREE</dd>
            </dl>
            <div className="mt-6 border-t border-line/10 pt-5">
              <div className="eyebrow mb-3">Referral loop · proposed campaign incentive</div>
              <ol className="space-y-1.5 font-mono text-[11px]">
                {["Register", "Get your unique referral link", "Share with friends", "2 friends register", "Project Starter Pack unlocked"].map((s, i) => (
                  <li key={s} className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">{i + 1}</span>{s}</li>
                ))}
              </ol>
              <p className="mt-3 text-[11px] text-muted-foreground/80">The workshop is free regardless of referrals.</p>
            </div>
          </div>
          <div id="register" className="reveal scroll-mt-20 rounded-2xl border border-primary/25 bg-card/80 p-5 md:col-span-3 md:p-6">
            <Registration />
          </div>
        </section>
      </main>

      <footer className="relative border-t border-line/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:px-5 md:flex-row md:items-center">
          <div>
            <div className="font-display text-base font-bold">Nxt<span className="text-primary">Wave</span></div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Growth Challenge Prototype</div>
          </div>
          <p className="max-w-[62ch] text-[11px] text-muted-foreground/80">
            This prototype was created for the NxtWave Growth Challenge. Workshop dates, project details, tools and incentives shown here are proposed simulation content and are not an official NxtWave announcement.
          </p>
          <Link to="/admin" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary">Admin dashboard →</Link>
        </div>
      </footer>
    </div>
  );
}
