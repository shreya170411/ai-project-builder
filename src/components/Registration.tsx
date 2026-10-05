import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ROLES, registerStudent, registrationSchema, getReferralStatus, getReferrerName, trackEvent } from "@/lib/campaign.functions";
import { getSessionId, getMyCode, setMyCode, clearMyCode } from "@/lib/session";
import { StarterPack } from "./StarterPack";

type Status = { firstName: string; code: string; count: number; unlocked: boolean };
const EMPTY = { name: "", email: "", phone: "", college: "", graduation_year: "", target_role: "" };

export function Registration() {
  const register = useServerFn(registerStudent);
  const fetchStatus = useServerFn(getReferralStatus);
  const fetchReferrer = useServerFn(getReferrerName);
  const track = useServerFn(trackEvent);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [ref, setRef] = useState<string>("");
  const [referrer, setReferrer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref")?.replace(/[^A-Za-z0-9]/g, "").slice(0, 20) ?? "";
    setRef(r);
    if (r) fetchReferrer({ data: { code: r } }).then((n) => setReferrer(n ?? null)).catch(() => {});
    const mine = getMyCode();
    if (mine) refresh(mine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // poll referral progress while waiting
  useEffect(() => {
    if (!status || status.unlocked) return;
    const t = setInterval(() => refresh(status.code), 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.code, status?.unlocked]);

  async function refresh(code: string) {
    const s = await fetchStatus({ data: { code } }).catch(() => null);
    if (s) setStatus(s);
    else clearMyCode();
  }

  function onFocus() {
    if (started.current) return;
    started.current = true;
    track({ data: { name: "registration_started", session: getSessionId() } }).catch(() => {});
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      if (errs["graduation_year"]) errs["graduation_year"] = "Select your graduation year";
      if (errs["target_role"]) errs["target_role"] = "Select a target role";
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await register({ data: { ...parsed.data, ref: ref || undefined, session: getSessionId() } });
      if (!res.ok) {
        setSubmitError(res.error);
        if (res.error.includes("email")) setErrors({ email: res.error });
        return;
      }
      setMyCode(res.code);
      setForm(EMPTY);
      await refresh(res.code);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const link = status && typeof window !== "undefined" ? `${window.location.origin}/?ref=${status.code}` : "";
  const waText = `I'm joining a free AI workshop where we'll build an AI Resume Analyzer in 60 minutes. Thought you'd be interested too: ${link}`;

  async function copy() {
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track({ data: { name: "referral_link_copied", session: getSessionId(), code: status?.code } }).catch(() => {});
  }
  function wa() {
    track({ data: { name: "whatsapp_share_clicked", session: getSessionId(), code: status?.code } }).catch(() => {});
  }
  function another() {
    clearMyCode();
    setStatus(null);
    started.current = false;
  }

  if (status) {
    const pct = Math.min(status.count, 2) * 50;
    return (
      <div>
        <div className="font-display text-2xl font-bold">You're in! 🎉</div>
        <p className="mt-1 text-sm text-muted-foreground">
          {status.firstName}, your seat for Sat 17 Oct · 6:00 PM IST is saved (simulated). The workshop stays free regardless of referrals.
        </p>
        {status.unlocked ? (
          <StarterPack />
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-line/15 p-4">
            <div className="font-display font-semibold">Want the AI Project Starter Pack?</div>
            <p className="text-sm text-muted-foreground">Invite 2 friends to register and unlock additional project resources.</p>
          </div>
        )}
        <div className="mt-4 rounded-xl border border-line/10 bg-background/50 p-4">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Your referral code</span>
            <span className="font-mono text-sm text-primary">{status.code}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono">{Math.min(status.count, 2)} / 2 referrals{status.count > 2 ? ` (+${status.count - 2})` : ""}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line/10">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 truncate rounded-md border border-line/15 bg-background/60 px-2.5 py-2 font-mono text-[11px] text-muted-foreground">{link}</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={wa}
              className="rounded-lg bg-success py-3 text-center font-display text-sm font-semibold text-primary-foreground"
            >
              Share on WhatsApp
            </a>
            <button onClick={copy} className="rounded-lg border border-line/15 py-3 font-display text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary">
              {copied ? "Copied ✓" : "Copy referral link"}
            </button>
          </div>
          <button onClick={() => refresh(status.code)} className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary">
            ↻ Refresh count
          </button>
        </div>
        <button onClick={another} className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:underline">
          Register another student on this device (demo)
        </button>
      </div>
    );
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} onFocus={onFocus} noValidate>
      <h2 className="mb-4 font-display text-xl font-bold tracking-tight">Register free</h2>
      {ref && (
        <p className="mb-3 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
          {referrer ? `${referrer} invited you` : "You were invited by a friend"} — referral code {ref.toUpperCase()}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div><input className="field" placeholder="Full name" autoComplete="name" value={form.name} onChange={set("name")} aria-label="Full name" />{err("name")}</div>
        <div><input className="field" type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={set("email")} aria-label="Email" />{err("email")}</div>
        <div><input className="field" type="tel" inputMode="tel" placeholder="WhatsApp / mobile number" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-label="WhatsApp or mobile number" />{err("phone")}</div>
        <div><input className="field" placeholder="College" value={form.college} onChange={set("college")} aria-label="College" />{err("college")}</div>
        <div>
          <select className="field" value={form.graduation_year} onChange={set("graduation_year")} aria-label="Graduation year">
            <option value="">Graduation year</option>
            {[2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {err("graduation_year")}
        </div>
        <div>
          <select className="field" value={form.target_role} onChange={set("target_role")} aria-label="Target role">
            <option value="">Target role</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {err("target_role")}
        </div>
      </div>
      {submitError && !errors["email"] && <p className="mt-3 text-sm text-destructive">{submitError}</p>}
      <button disabled={loading} className="mt-4 w-full rounded-lg bg-primary py-3 font-display text-sm font-semibold text-primary-foreground ring-1 ring-primary/40 transition-colors hover:bg-primary/90 disabled:opacity-60">
        {loading ? "Registering…" : "REGISTER FREE"}
      </button>
      <div className="mt-4 rounded-xl border border-dashed border-line/15 p-3.5">
        <div className="eyebrow mb-1">Referral loop</div>
        <p className="text-sm text-muted-foreground">
          After registering you'll get a unique referral link. Invite 2 friends to unlock the proposed Project Starter Pack — the workshop stays free regardless.
        </p>
      </div>
    </form>
  );
}
