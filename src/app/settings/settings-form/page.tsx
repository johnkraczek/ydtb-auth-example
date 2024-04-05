import { SettingPage } from "~/client/components/basic/setting-page";
import { SettingsPageForm } from "~/client/components/settings/updateForm/settings-page-form";

const SettingsUpdatePage = () => {
  return (
    <SettingPage
      title="Role Example"
      label="An example show-casing updating token data"
    >
      <SettingsPageForm />
    </SettingPage>
  );
};
export default SettingsUpdatePage;
