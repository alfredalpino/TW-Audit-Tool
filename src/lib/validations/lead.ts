import { z } from "zod";

export const createLeadSchema = z.object({
  runId: z.string().uuid("Invalid audit run ID"),
  email: z.string().email("Enter a valid email"),
  name: z.string().min(1).max(255).optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
