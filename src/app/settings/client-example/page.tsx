"use client";
import { SettingPage } from "~/client/components/basic/setting-page";
import UserInfo from "~/client/components/settings/user-info";
import { useCurrentUser } from "~/client/hooks/use-current-user";

export default function ClientExample() {
  const user = useCurrentUser();
  return (
    <SettingPage
      title="Client Example"
      label="This page was generated as a client component"
    >
      <UserInfo label=" 🤷‍♂️ Client Component" user={user} />
    </SettingPage>
  );
}
