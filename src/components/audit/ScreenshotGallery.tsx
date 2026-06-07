"use client";

import Image from "next/image";
import { useState } from "react";
import type { ScreenshotDto } from "@/types/audit";
import { cn } from "@/lib/utils";

export function ScreenshotGallery({
  screenshots,
  url,
}: {
  screenshots: ScreenshotDto[];
  url: string;
}) {
  const desktop = screenshots.find((s) => s.viewport === "desktop");
  const mobile = screenshots.find((s) => s.viewport === "mobile");
  const [active, setActive] = useState<"desktop" | "mobile">(
    desktop ? "desktop" : "mobile"
  );

  const current = active === "desktop" ? desktop : mobile;

  if (!desktop && !mobile) {
    return (
      <div className="tw-panel flex min-h-[200px] items-center justify-center p-8 text-center">
        <p className="text-sm text-[var(--fg-tertiary)]">
          Site previews are captured during the audit. Re-run the audit if
          screenshots are missing.
        </p>
      </div>
    );
  }

  return (
    <section className="tw-panel min-w-0 overflow-hidden p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)]">
            Site preview
          </p>
          <h2 className="mt-1 font-display text-lg font-bold">Live capture</h2>
          <p className="tw-contain-text mt-1 text-sm text-[var(--fg-secondary)]">
            Desktop and mobile renders of{" "}
            <span className="text-[var(--fg-primary)]">{url}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {desktop && (
            <button
              type="button"
              onClick={() => setActive("desktop")}
              className={cn(
                "tw-clay-btn tw-clay-btn-secondary px-4 py-2 font-mono text-[10px] uppercase tracking-wider",
                active === "desktop" && "ring-2 ring-[var(--brand)]"
              )}
            >
              Desktop
            </button>
          )}
          {mobile && (
            <button
              type="button"
              onClick={() => setActive("mobile")}
              className={cn(
                "tw-clay-btn tw-clay-btn-secondary px-4 py-2 font-mono text-[10px] uppercase tracking-wider",
                active === "mobile" && "ring-2 ring-[var(--brand)]"
              )}
            >
              Mobile
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-muted)] shadow-[var(--keycap-drop-rest)]",
            active === "mobile" ? "w-[220px]" : "w-full max-w-4xl"
          )}
        >
          {current && (
            <Image
              src={current.url}
              alt={`${active} screenshot of ${url}`}
              width={current.width ?? (active === "mobile" ? 390 : 1280)}
              height={current.height ?? (active === "mobile" ? 844 : 720)}
              className={cn(
                "h-auto w-full object-cover object-top",
                active === "mobile" && "max-h-[480px]"
              )}
              unoptimized
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/90">
              {active} · {current?.width ?? "—"}×{current?.height ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
