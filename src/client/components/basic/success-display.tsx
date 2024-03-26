import { CheckCircledIcon } from "@radix-ui/react-icons";

export const ShowSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CheckCircledIcon />
      <span>{message}</span>
    </div>
  );
};
