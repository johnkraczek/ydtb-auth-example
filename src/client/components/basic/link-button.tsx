import Link from "next/link";
import { Button } from "../ui/button";

export const LinkButton = ({
  label,
  href,
}: {
  label: string;
  href: string;
}) => {
  return (
    <Button variant="link" className="w-full font-normal" size={"sm"} asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
