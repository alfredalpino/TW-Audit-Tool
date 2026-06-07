"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuditUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const text = await res.text();
      let data: { error?: string; runId?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { error?: string; runId?: string };
        } catch {
          setError(
            res.ok
              ? "Unexpected response from server"
              : `Request failed (${res.status})`
          );
          return;
        }
      }
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      if (!data.runId) {
        setError("Unexpected response from server");
        return;
      }
      router.push(`/audit/${data.runId}`);
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id="audit"
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch"
    >
      <div className="min-w-0 flex-1 sm:min-w-[12rem]">
        <Input
          type="url"
          name="url"
          placeholder="https://www.yoursite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          aria-label="Website URL"
          autoComplete="url"
          inputMode="url"
          className="min-w-0"
        />
        <p className="mt-1.5 font-mono text-[10px] text-[var(--fg-tertiary)]">
          Use your full URL with https:// — e.g. https://www.yoursite.com or
          yoursite.com
        </p>
      </div>
      <Button type="submit" variant="brand" size="lg" withArrow disabled={loading} className="w-full shrink-0 sm:w-auto">
        {loading ? "Starting…" : "Analyze My Website"}
      </Button>
      {error && (
        <p className="w-full text-sm text-red-400 sm:col-span-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
