const ITEMS = [
  { t: "AI project preparation checklist", d: ["Python 3.10+ installed and working", "Code editor (VS Code) ready", "GitHub account created", "A sample resume PDF on your laptop", "LLM API key (free tier) noted down"] },
  { t: "AI workflow cheat sheet", d: ["Input → Extract → Prompt → Parse → Compare → Present", "Keep prompts structured: role, task, format, constraints", "Always ask the model for JSON output you can validate", "Log inputs/outputs so you can debug"] },
  { t: "Project documentation template", d: ["Problem statement", "Who it helps", "Architecture diagram", "Key decisions & trade-offs", "Limitations and next steps"] },
  { t: "README template", d: ["Project title + one-line pitch", "Demo screenshot / link", "Tech stack", "How to run locally", "How it works (3–5 bullets)", "Future improvements"] },
  { t: "Interview explanation checklist", d: ["Explain the problem in 1 sentence", "Walk through the pipeline step by step", "Why an LLM vs rules?", "How you handled bad or messy input", "What you'd improve with more time"] },
  { t: "Post-workshop implementation notes", d: ["Add multiple target roles", "Score resumes 0–100 against a role", "Export the report as PDF", "Optional: automate with n8n workflows"] },
];

export function StarterPack() {
  return (
    <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
      <div className="font-display text-lg font-bold">🎉 Project Starter Pack Unlocked</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Proposed campaign incentive for this simulation — not an officially approved NxtWave reward.
      </p>
      <div className="mt-3 space-y-2">
        {ITEMS.map((i) => (
          <details key={i.t} className="group rounded-lg border border-line/10 bg-background/50 px-3 py-2">
            <summary className="cursor-pointer list-none text-sm font-medium flex justify-between">
              {i.t}
              <span className="font-mono text-accent group-open:rotate-45 transition-transform">+</span>
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {i.d.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-primary">·</span>{x}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
