import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .optional(),
  image: z.string().optional(),
});
