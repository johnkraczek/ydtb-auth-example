"use server";
import { SettingPage } from "~/client/components/basic/setting-page";
import UserInfo from "~/client/components/settings/user-info";
import { currentUser } from "~/server/auth/actions/user";

export default async function SettingsProfilePage() {
  const user = await currentUser();
  return (
    <SettingPage
      title="Settings Page"
      label="Basic user Account Information display"
    >
      <UserInfo user={user} label="Your Info (Server Component)" />
    </SettingPage>
  );
}
