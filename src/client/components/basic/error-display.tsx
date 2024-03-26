import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface formErrorProps {
  message?: string;
  link?: {
    href: string;
    text: string;
  };
}

export const ShowError = ({ message, link }: formErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive flex items-start justify-between gap-x-2 rounded-md p-4 text-sm">
      <div className="flex items-center justify-center gap-x-2">
        <ExclamationTriangleIcon className="mt-1" />
        <span>{message}</span>
      </div>
      {link && <a href={link.href}>{link.text}</a>}
    </div>
  );
};
