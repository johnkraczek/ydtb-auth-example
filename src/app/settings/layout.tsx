import { Metadata } from "next";
import { SidebarNav } from "~/client/components/nav/sidebar-nav";
import { Separator } from "~/client/components/ui/separator";
import { Card, CardContent } from "~/client/components/ui/card";
import { UserButton } from "~/client/components/auth/user-button";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth";
import { Toaster } from "~/client/components/ui/sonner";

export const metadata: Metadata = {
  title: "Settings",
  description: "Updating user info",
};

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/settings",
  },
  {
    title: "2FA Methods",
    href: "/settings/two-factor",
  },
  {
    title: "OAuth Providers",
    href: "/settings/oAuth-providers",
  },
  {
    title: "Role Example",
    href: "/settings/role-example",
  },
  {
    title: "Client Example",
    href: "/settings/client-example",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="h-full bg-slate-100 p-32">
        <Card className=" shadow-lg">
          <CardContent>
            <div className="hidden space-y-6 p-10 pb-16 md:block">
              <div className="flex flex-row justify-between align-middle">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your account settings.
                  </p>
                </div>
                <div className="self-center">
                  <UserButton />
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 max-w-[200px] lg:w-1/5">
                  <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="min-h-[500px] flex-1 lg:max-w-2xl">
                  {children}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
