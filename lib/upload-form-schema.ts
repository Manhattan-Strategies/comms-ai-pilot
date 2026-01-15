import { z } from "zod";

/**
 * Validation schema for PDF upload form
 * File is optional - users can generate posts from chat prompt alone
 */
export const uploadFormSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 32 * 1024 * 1024,
      "File size must be less than 32MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    )
    .optional()
    .nullable(),
});
