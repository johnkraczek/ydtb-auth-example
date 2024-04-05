"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { profileFormSchema } from "~/validation/settings";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Link from "next/link";
import { Button } from "../../ui/button";
import {
  FetchSettingsFormData,
  SettingsFormAction,
} from "~/server/actions/settings-form";
import { useEffect, useState, useTransition } from "react";
import { Skeleton, SVGSkeleton } from "../../ui/skeleton";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useSession } from "next-auth/react";

export function SettingsPageForm() {
  const { update } = useSession();
  const [formData, setFormData] = useState<Awaited<
    ReturnType<typeof FetchSettingsFormData>
  > | null>(null);
  const [isPending, startTransistion] = useTransition();

  const fetchUserData = () => {
    startTransistion(async () => {
      const data = await FetchSettingsFormData();
      if (!data) {
        return;
      }
      setFormData(data);
      form.setValue("name", data.name || "");
      form.setValue("email", data.email);
      form.setValue("image", data.image || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  useEffect(fetchUserData, []);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
  });

  const submitfn = async (values: z.infer<typeof profileFormSchema>) => {
    const results = await SettingsFormAction(values);

    if (!results.success) {
      toast("Something Went Wrong Saving your Settings.");
    }
    toast("Your new info was submitted successfully. ");
    update();
  };

  const reduceName = (name?: string) => {
    if (!name) return "";
    return name
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(submitfn)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              {formData === null ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FormControl>
                  <Input placeholder="Jon Doe" {...field} />
                </FormControl>
              )}

              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login Email</FormLabel>
              {formData === null ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData?.emails.map((email) => {
                      return (
                        <SelectItem key={email} value={email}>
                          {email}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}

              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select your profile image</FormDescription>
              <FormMessage />

              {formData == null ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row"
                >
                  {formData?.images.map((image, index) => {
                    return (
                      <FormItem key={index}>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value={image} className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-full border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                            <Avatar>
                              <AvatarImage src={image} />
                            </Avatar>
                          </div>
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem
                          value={reduceName(formData?.name!)}
                          className="sr-only"
                        />
                      </FormControl>
                      <div className="items-center rounded-full border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                        <Avatar>
                          <AvatarFallback>
                            {reduceName(formData?.name!)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              )}
            </FormItem>
          )}
        />
        <Button disabled={formData === null} type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
