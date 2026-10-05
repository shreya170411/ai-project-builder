import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ROLES = [
  "Data Analyst",
  "Software Developer",
  "QA Engineer",
  "AI / ML Engineer",
  "Product Analyst",
  "Other",
] as const;

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a valid 10-digit Indian mobile number"),
  college: z.string().trim().min(2, "Enter your college").max(150),
  graduation_year: z.coerce.number().int().min(2024).max(2030),
  target_role: z.enum(ROLES),
});

const registerInput = registrationSchema.extend({
  ref: z.string().trim().max(20).regex(/^[A-Za-z0-9]*$/).optional(),
  session: z.string().max(64).optional(),
});

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const registerStudent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => registerInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: res, error } = await db.rpc("register_student", {
      _name: data.name,
      _email: data.email,
      _phone: data.phone,
      _college: data.college,
      _year: data.graduation_year,
      _role: data.target_role,
      _ref: data.ref ?? "",
      _session: data.session ?? "",
    });
    if (error) {
      console.error(error);
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }
    const r = res as { error?: string; code?: string };
    if (r.error === "duplicate_email")
      return { ok: false as const, error: "This email is already registered." };
    return { ok: true as const, code: r.code! };
  });

export const getReferralStatus = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ code: z.string().max(20).regex(/^[A-Za-z0-9]+$/) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row } = await db
      .from("registrations")
      .select("name, referral_code, referral_count, reward_unlocked")
      .eq("referral_code", data.code.toUpperCase())
      .maybeSingle();
    if (!row) return null;
    return { firstName: row.name.split(" ")[0] ?? "", code: row.referral_code, count: row.referral_count, unlocked: row.reward_unlocked };
  });

export const getReferrerName = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ code: z.string().max(20).regex(/^[A-Za-z0-9]+$/) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row } = await db.from("registrations").select("name").eq("referral_code", data.code.toUpperCase()).maybeSingle();
    return row ? row.name.split(" ")[0] ?? "" : null;
  });

const EVENTS = ["landing_view", "registration_started", "referral_link_copied", "whatsapp_share_clicked"] as const;

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ name: z.enum(EVENTS), session: z.string().max(64).optional(), code: z.string().max(20).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    await db.from("events").insert({ name: data.name, session_id: data.session ?? null, meta: data.code ? { code: data.code } : null });
    return { ok: true };
  });

export const getAdminStats = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ passcode: z.string().max(100) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSCODE"] ?? "nxtgrowth2026";
    if (data.passcode !== expected) return { ok: false as const };
    const db = await admin();
    const [{ data: regs }, { data: events }] = await Promise.all([
      db.from("registrations").select("name, college, target_role, graduation_year, referral_code, referred_by, referral_count, reward_unlocked, created_at").order("created_at", { ascending: false }).limit(5000),
      db.from("events").select("name, session_id").limit(20000),
    ]);
    const r = regs ?? [];
    const e = events ?? [];
    const today = new Date().toISOString().slice(0, 10);
    const byDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) byDay[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
    const byRole: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    for (const x of r) {
      const d = x.created_at.slice(0, 10);
      if (d in byDay) byDay[d] = (byDay[d] ?? 0) + 1;
      byRole[x.target_role] = (byRole[x.target_role] ?? 0) + 1;
      const y = String(x.graduation_year);
      byYear[y] = (byYear[y] ?? 0) + 1;
    }
    const uniq = (n: string) => new Set(e.filter((x) => x.name === n).map((x) => x.session_id || Math.random())).size;
    const referred = r.filter((x) => x.referred_by).length;
    return {
      ok: true as const,
      total: r.length,
      today: r.filter((x) => x.created_at.slice(0, 10) === today).length,
      referred,
      referralRate: r.length ? Math.round((referred / r.length) * 100) : 0,
      rewards: r.filter((x) => x.reward_unlocked).length,
      top: r.filter((x) => x.referral_count > 0).sort((a, b) => b.referral_count - a.referral_count).slice(0, 5).map((x) => ({ name: x.name, college: x.college, count: x.referral_count, unlocked: x.reward_unlocked })),
      byDay: Object.entries(byDay),
      byRole: Object.entries(byRole).sort((a, b) => b[1] - a[1]),
      byYear: Object.entries(byYear).sort((a, b) => a[0].localeCompare(b[0])),
      totalReferrals: r.reduce((a, x) => a + x.referral_count, 0),
      topCodes: r.filter((x) => x.referral_count > 0).sort((a, b) => b.referral_count - a.referral_count).slice(0, 5).map((x) => ({ code: x.referral_code, count: x.referral_count })),
      funnel: {
        visits: uniq("landing_view"),
        starts: uniq("registration_started"),
        completed: r.length,
        referred,
      },
      shares: {
        copied: e.filter((x) => x.name === "referral_link_copied").length,
        whatsapp: e.filter((x) => x.name === "whatsapp_share_clicked").length,
      },
      recent: r.slice(0, 8).map((x) => ({ name: x.name, college: x.college, role: x.target_role, referred: !!x.referred_by, at: x.created_at })),
    };
  });
