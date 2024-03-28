import "server-only";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { LoginSchema } from "~/validation/auth";
import {
  getUserByEmail,
  userExistsByEmail,
  verifyUserCredentials,
} from "~/server/data/user";

const credentialProvider = Credentials({
  async authorize(credentials) {
    const validatedFields = LoginSchema.safeParse(credentials);

    if (validatedFields.success) {
      const { email, password } = validatedFields.data;

      const exists = await userExistsByEmail(email, true);
      if (!exists) return null;

      const passwordsMatch = await verifyUserCredentials(email, password);

      if (passwordsMatch) return await getUserByEmail(email);
    }
    return null;
  },
});

const googleProvider = Google({
  id: "google",
  name: "Google",
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const discordProvider = Discord({
  id: "discord",
  name: "Discord",
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
});

const gitHubProvider = GitHub({
  id: "github",
  name: "GitHub",
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

export { credentialProvider, googleProvider, discordProvider, gitHubProvider };
