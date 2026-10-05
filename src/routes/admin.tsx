import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminStats } from "@/lib/campaign.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Growth Dashboard — AI Workshop Campaign (Prototype)" },
      { name: "description", content: "Admin view of registrations, referrals and funnel metrics for the simulated AI workshop campaign." },
      { property: "og:title", content: "Growth Dashboard — AI Workshop Campaign" },
      { property: "og:description", content: "Registrations, referral loop and funnel metrics for the Growth Challenge prototype." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Stats = Extract<Awaited<ReturnType<typeof getAdminStats>>, { ok: true }>;

function Bar({ label, value, max, tone = "bg-primary" }: { label: string; value: number; max: number; tone?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-32 shrink-0 truncate font-mono text-[11px] text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="w-10 text-right font-mono text-xs">{value}</span>
    </div>
  );
}

function Admin() {
  const fetchStats = useServerFn(getAdminStats);
  const [pass, setPass] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(p = pass) {
    setLoading(true);
    setErr("");
    try {
      const r = await fetchStats({ data: { passcode: p } });
      if (!r.ok) setErr("Incorrect passcode");
      else setStats(r);
    } catch {
      setErr("Could not load stats");
    } finally {
      setLoading(false);
    }
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="bento w-full max-w-sm p-6">
          <div className="eyebrow mb-2">Admin · Growth dashboard</div>
          <h1 className="mb-4 font-display text-xl font-bold">Enter demo passcode</h1>
          <input type="password" className="field" placeholder="Passcode" value={pass} onChange={(e) => setPass(e.target.value)} aria-label="Passcode" />
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
          <button disabled={loading} className="mt-4 w-full rounded-lg bg-primary py-3 font-display text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {loading ? "Loading…" : "Open dashboard"}
          </button>
          <Link to="/" className="mt-4 block text-center font-mono text-[11px] text-muted-foreground hover:text-primary">← Back to landing page</Link>
        </form>
      </div>
    );
  }

  const s = stats;
  const fMax = Math.max(s.funnel.visits, s.funnel.starts, s.funnel.completed, 1);
  const dayMax = Math.max(...s.byDay.map((d) => d[1]), 1);
  const roleMax = Math.max(...s.byRole.map((d) => d[1]), 1);
  const yearMax = Math.max(...s.byYear.map((d) => d[1]), 1);
  const kpis: [string, string | number, string][] = [
    ["Total registrations", s.total, "text-primary"],
    ["Registrations today", s.today, ""],
    ["Total referrals", s.totalReferrals, ""],
    ["Referral conversion", `${s.referralRate}%`, "text-accent"],
    ["Rewards unlocked", s.rewards, ""],
    ["Goal progress", `${Math.round((s.total / 500) * 100)}%`, "text-primary"],
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5">
          <Link to="/" className="font-display text-sm font-bold">Nxt<span className="text-primary">Wave</span> <span className="font-mono text-[10px] text-muted-foreground">/ admin</span></Link>
          <button onClick={() => load()} className="rounded-md border border-line/15 px-3 py-1.5 font-mono text-xs hover:border-primary/50 hover:text-primary">{loading ? "…" : "↻ Refresh"}</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-3 px-4 py-6 sm:px-5">
        <p className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-accent">
          Live data from this prototype's database (test registrations only). Goal: 500 registrations in 7 days. No simulated numbers are mixed in.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {kpis.map(([l, v, c]) => (
            <div key={l} className="bento p-4">
              <div className={`font-display text-2xl font-bold ${c}`}>{v}</div>
              <div className="eyebrow mt-1">{l}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <section className="bento p-5">
            <div className="eyebrow mb-3">Funnel (unique sessions)</div>
            <div className="space-y-2">
              <Bar label="Landing visits" value={s.funnel.visits} max={fMax} tone="bg-primary/40" />
              <Bar label="Registration starts" value={s.funnel.starts} max={fMax} tone="bg-primary/60" />
              <Bar label="Completed" value={s.funnel.completed} max={fMax} />
              <Bar label="Referred regs" value={s.funnel.referred} max={fMax} tone="bg-accent" />
            </div>
            <div className="mt-4 flex gap-4 font-mono text-[11px] text-muted-foreground">
              <span>Links copied: {s.shares.copied}</span><span>WhatsApp shares: {s.shares.whatsapp}</span>
            </div>
          </section>
          <section className="bento p-5">
            <div className="eyebrow mb-3">Top referrers</div>
            {s.top.length === 0 ? <p className="text-sm text-muted-foreground">No referrals yet.</p> : (
              <ul className="space-y-2">
                {s.top.map((t, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-line/10 pb-2 text-sm">
                    <span>{t.name} <span className="text-xs text-muted-foreground">· {t.college}</span></span>
                    <span className="font-mono text-primary">{t.count}{t.unlocked && <span className="ml-2 text-accent">★</span>}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="bento p-5">
            <div className="eyebrow mb-3">Registrations by day (last 7)</div>
            <div className="flex h-36 items-end gap-2">
              {s.byDay.map(([d, v]) => (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px]">{v}</span>
                  <div className="w-full rounded-t bg-primary/70" style={{ height: `${(v / dayMax) * 100}px`, minHeight: 2 }} />
                  <span className="font-mono text-[9px] text-muted-foreground">{d.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="bento p-5">
            <div className="eyebrow mb-3">By target role</div>
            <div className="space-y-2">
              {s.byRole.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : s.byRole.map(([r, v]) => <Bar key={r} label={r} value={v} max={roleMax} />)}
            </div>
          </section>
          <section className="bento p-5">
            <div className="eyebrow mb-3">By graduation year</div>
            <div className="space-y-2">
              {s.byYear.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : s.byYear.map(([y, v]) => <Bar key={y} label={y} value={v} max={yearMax} tone="bg-accent" />)}
            </div>
          </section>
          <section className="bento p-5">
            <div className="eyebrow mb-3">Top referral codes</div>
            {s.topCodes.length === 0 ? <p className="text-sm text-muted-foreground">No referrals yet.</p> : (
              <ul className="space-y-2 font-mono text-sm">
                {s.topCodes.map((t) => <li key={t.code} className="flex justify-between border-b border-line/10 pb-2"><span>{t.code}</span><span className="text-primary">{t.count}</span></li>)}
              </ul>
            )}
          </section>
        </div>
        <section className="bento overflow-x-auto p-5">
          <div className="eyebrow mb-3">Recent registrations</div>
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[10px] uppercase text-muted-foreground"><tr><th className="py-1">Name</th><th>College</th><th>Role</th><th>Source</th></tr></thead>
            <tbody>
              {s.recent.map((r, i) => (
                <tr key={i} className="border-t border-line/10"><td className="py-2">{r.name}</td><td>{r.college}</td><td>{r.role}</td><td className={r.referred ? "text-accent" : "text-muted-foreground"}>{r.referred ? "Referral" : "Direct"}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
