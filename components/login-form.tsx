"use client";

import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(1, "Student number or username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // Demo only: replace this with your authentication API.
      console.log("Login submitted:", { username: values.username });

      toast.success("Login form submitted", {
        description: `Username: ${values.username}`,
      });
    } catch {
      toast.error("Unable to sign in. Please try again.");
    }
  }

  function onInvalid(errors: FieldErrors<LoginFormValues>) {
    if (errors.username?.message) {
      toast.error(String(errors.username.message));
      return;
    }
    if (errors.password?.message) {
      toast.error(String(errors.password.message));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={cn(
          "mx-auto flex w-full min-w-0 max-w-sm flex-col gap-5",
          "px-4 sm:px-0",
          className,
        )}
        {...props}
      >
        {/* UC Logo */}
        <div className="mb-2 flex justify-center lg:hidden">
          <div
            className="flex size-35 items-center justify-center rounded-full
               border-4 border-green-100
               bg-gradient-to-br from-green-600 to-green-800
               text-4xl font-extrabold tracking-wider text-white
               shadow-lg shadow-green-900/20
               ring-2 ring-green-700/20"
            role="img"
            aria-label="UC logo"
          >
            UC
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Use your student number or staff username.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="min-w-0 space-y-2">
                <FormLabel>Student No. / Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your student number"
                    autoComplete="username"
                    className="h-11 w-full text-base"
                  />
                </FormControl>
                <FormDescription className="text-xs leading-relaxed">
                  Student number format: YYYY-NNNNN
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="min-w-0 space-y-2">
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-11 w-full pr-11 text-base"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center justify-center px-5 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
                <div className="flex justify-end">
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-green-700 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-11 w-full cursor-pointer gap-2 bg-green-700 text-white hover:bg-green-800"
        >
          <LogIn className="size-4" />
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
