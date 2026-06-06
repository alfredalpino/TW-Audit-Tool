"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadCaptureForm({
  runId,
  onUnlocked,
}: {
  runId: string;
  onUnlocked?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, name, email, company: company || undefined }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save — try again.");
      setStatus("error");
      return;
    }
    setStatus("done");
    onUnlocked?.();
    window.location.reload();
  }

  if (status === "done") {
    return (
      <p className="font-mono text-xs text-[var(--accent-blue)]">
        Full report unlocked — PDF generating & email sending if configured…
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="min-w-0 space-y-3">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Name"
        />
        <Input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
      </div>
      <Input
        placeholder="Company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        aria-label="Company"
      />
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Unlocking…" : "Unlock full report"}
      </Button>
    </form>
  );
}
