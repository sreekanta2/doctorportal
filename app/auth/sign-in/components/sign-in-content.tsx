"use client";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginPageContent() {
  // Get the callbackUrl from the URL search parameters.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: callbackUrl || undefined,
      });

      if (res?.error) {
        toast.error("Invalid credentials!");
      } else {
        toast.success("Login successful");
        const session = await getSession();
        const role = session?.user?.role as UserRole;

        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (role) {
          router.push(`/${role}/dashboard`);
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center mt-12">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-xl bg-background">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-3xl font-bold text-gray-800">
            Sign In
          </h2>
          <p className="text-center text-sm text-gray-600">
            Access your account to continue
          </p>
        </div>

        <Separator className="my-6 bg-blue-100" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="your@gmail.com"
              required
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="Password"
              placeholder="********"
              type="password"
              required
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>

              <Link
                href="/auth/forget-password"
                className="text-sm text-default-600"
              >
                Forget Password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
