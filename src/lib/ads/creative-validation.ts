import { z } from "zod";

export const adCreativeInputSchema = z.object({
  campaignId: z.string().min(1),
  type: z.enum(["image", "video", "html", "text", "link", "social_copy"]).default("image"),
  title: z.string().trim().max(120).optional().default(""),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  videoUrl: z.string().trim().url().optional().or(z.literal("")),
  text: z.string().trim().max(2000).optional().default(""),
  targetUrl: z.string().trim().url("Enter a valid https:// target URL."),
  altText: z.string().trim().max(180).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});

export function validateSafeAdTargetUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
