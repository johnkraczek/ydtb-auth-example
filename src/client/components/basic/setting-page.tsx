import { Separator } from "../ui/separator";

export const SettingPage = ({
  children,
  title,
  label,
}: {
  children: React.ReactNode;
  title: string;
  label: string;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <Separator />
      {children}
    </div>
  );
};
