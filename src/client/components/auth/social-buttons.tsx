"use client";
import React from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { Button } from "~/client/components/ui/button";
import { signIn } from "next-auth/react";

export const SocialButtons = () => {
  const handleSocialLogin = async (
    provider: "google" | "discord" | "github",
  ) => {
    signIn(provider);
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleSocialLogin("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleSocialLogin("discord")}
      >
        <FaDiscord className="h-5 w-5 text-[#5865F2]" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleSocialLogin("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
