import "~/client/styles/global.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Auth Example",
  description: "Example of Next-Auth by YDTB",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`font-sans ${inter.variable}  h-full`}>{children}</body>
    </html>
  );
}
