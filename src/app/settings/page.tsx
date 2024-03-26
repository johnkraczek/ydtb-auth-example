import { DefaultSettings } from "~/client/components/settings/default-settings";
import { SettingPage } from "~/client/components/basic/setting-page";

export default function SettingsProfilePage() {
  return (
    <SettingPage title="Profile" label="Basic user Account Information">
      <DefaultSettings />
    </SettingPage>
  );
}
