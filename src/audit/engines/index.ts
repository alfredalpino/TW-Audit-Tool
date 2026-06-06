import type { AuditEngine } from "@/audit/types";
import { seoEngine } from "./seo";
import { speedEngine } from "./speed";
import { accessibilityEngine } from "./accessibility";
import { technicalEngine } from "./technical";
import { securityEngine } from "./security";
import { croEngine } from "./cro";
import { uxEngine } from "./ux";
import { aiReadinessEngine } from "./ai-readiness";
import { complianceEngine } from "./compliance";
import { mobileEngine } from "./mobile";
import { contentEngine } from "./content";
import { screenshotIntelligenceEngine } from "./screenshot-intelligence";

export const AUDIT_ENGINES: AuditEngine[] = [
  seoEngine,
  technicalEngine,
  uxEngine,
  croEngine,
  securityEngine,
  complianceEngine,
  aiReadinessEngine,
  contentEngine,
  mobileEngine,
  accessibilityEngine,
  screenshotIntelligenceEngine,
  speedEngine,
];

export const ENGINE_IDS = AUDIT_ENGINES.map((e) => e.id);
