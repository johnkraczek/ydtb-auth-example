import { z } from "zod";
import { UserRole } from "~/server/db/schemas/users/user-account";

export const profileFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .optional(),
  image: z.string().optional(),
  role: z
    .string()
    .array()
    .optional()
    .refine((roleList) => {
      if (!roleList || roleList?.length == 0) return true;
      return Object.values(UserRole).some((role, i, list) => {
        return !list.includes(role);
      });
    }),
});
