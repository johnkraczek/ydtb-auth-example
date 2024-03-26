import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

import React from "react";
import { cn } from "../utils";

export const Header = ({
  title = "🔐 Authentication",
  label = "Welcome Back",
}: {
  title?: string;
  label?: string;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className={cn("pt-10 text-3xl font-semibold", font.className)}>
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
