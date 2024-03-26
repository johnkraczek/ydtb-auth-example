"use client";

import React from "react";
import { Header } from "~/client/components/basic/header";
import { Card, CardContent, CardFooter } from "../ui/card";
import { LinkButton } from "../basic/link-button";
import { SocialButtons } from "~/client/components/auth/social-buttons";

export const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: {
  children: React.ReactNode;
  headerTitle: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}) => {
  return (
    <Card className="w-[400px] border-none shadow-none">
      <Header title={headerTitle} label={headerLabel} />
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter className="pt-10">
          <SocialButtons />
        </CardFooter>
      )}
      <CardFooter>
        <LinkButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
