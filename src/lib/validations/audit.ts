import { z } from "zod";

const auditCategorySchema = z.enum([
  "seo",
  "speed",
  "ux",
  "cro",
  "technical",
  "accessibility",
  "security",
  "compliance",
  "ai_readiness",
  "mobile",
]);

export const createAuditSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .max(2048)
    .transform((val) => {
      const trimmed = val.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    })
    .pipe(z.string().url("Enter a valid website URL")),
  categories: z.array(auditCategorySchema).optional(),
  options: z
    .object({
      mobile: z.boolean().optional(),
      desktop: z.boolean().optional(),
    })
    .optional(),
});

export type CreateAuditInput = z.infer<typeof createAuditSchema>;
