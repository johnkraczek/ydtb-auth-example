"use client";
import { SettingPage } from "~/client/components/basic/setting-page";
import { TwoFactorList } from "~/client/components/settings/two-factor-methods/two-factor-list";

export default function SettingsProfilePage() {
  return (
    <SettingPage title="Two Factor" label="Available Two Factor methods">
      <TwoFactorList />
    </SettingPage>
  );
}
