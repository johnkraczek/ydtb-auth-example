import { useForm } from "react-hook-form";
import { z } from "zod";
import { twoFactorDisplay } from "~/server/db/schemas/users/two-factor-methods";
import { LoginSchema } from "~/validation/auth";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Button } from "../../ui/button";

export const MethodChoice = ({
  form,
  twoFaMethods,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof LoginSchema>>>;
  isPending: boolean;
  twoFaMethods: twoFactorDisplay[];
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="method"
        render={({ field }) => (
          <FormItem className="text-center">
            <FormLabel>Choose a registered 2FA Method</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {twoFaMethods.map((method) => (
                  <Button
                    key={method.method}
                    asChild
                    variant={
                      field.value == method.method ? "secondary" : "outline"
                    }
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={method.method}>
                          {method.label}
                        </RadioGroupItem>
                      </FormControl>
                      <FormLabel className="font-normal">
                        {method.label}
                      </FormLabel>
                    </FormItem>
                  </Button>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
