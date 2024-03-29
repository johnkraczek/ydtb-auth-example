"use client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ShowError } from "~/client/components/basic/error-display";
import { SettingPage } from "~/client/components/basic/setting-page";
import { AccountList } from "~/client/components/settings/connected-accounts/accountList";

const learnMoreLink = {
  href: "/kb/learn-more",
  text: "Learn More",
};

export default function OAuthProvidersPage() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const accountNotLinkedError =
    searchParams.get("error") === "OAuthAccountNotLinked";

  const onSettingsUpdate = async () => {
    startTransition(async () => {
      //
      update();
    });
  };
  return (
    <SettingPage
      title="oAuth Providers"
      label="Add or Remove oAuth Providers for your account. "
    >
      {accountNotLinkedError && (
        <ShowError
          message="That provider is already linked to an account. Try another?"
          link={learnMoreLink}
        />
      )}
      <AccountList />
    </SettingPage>
  );
}
