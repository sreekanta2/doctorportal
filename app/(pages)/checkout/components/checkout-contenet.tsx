"use client";

import { createOrUpdateSubscription } from "@/action/action.subscription";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  CreateSubscriptionInput,
  CreateSubscriptionSchema,
} from "@/zod-validation/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { PricePlan } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [bkashModalOpen, setBkashModalOpen] = useState(false);
  const [pricingPlan, setPricingPlan] = useState<PricePlan | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { data: session } = useSession();

  const plan = searchParams?.get("plan") as string;

  const form = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(CreateSubscriptionSchema),
    defaultValues: {
      pricePlanId: "",
      email: session?.user?.email || "",
      bkashNumber: "",
      transactionId: "",
      status: "INACTIVE",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  useEffect(() => {
    if (!plan) return;
    const fetchPricingPlan = async () => {
      try {
        const res = await fetch(`/api/pricing-plan/${plan}`);
        if (!res.ok) throw new Error("Failed to fetch pricing plan");
        const data = await res.json();
        setPricingPlan(data?.data);
        form.setValue("email", session?.user?.email || "");
        form.setValue("pricePlanId", data?.data?.id || "");
      } catch (error) {
        console.error("Error fetching pricing plan:", error);
      }
    };
    fetchPricingPlan();
  }, [plan, session?.user?.email, form]);

  const onSubmit: SubmitHandler<CreateSubscriptionInput> = (data) => {
    startTransition(async () => {
      try {
        const result = await createOrUpdateSubscription(data);

        if (result.success) {
          toast.success(result?.message);
          setPaymentSuccess(true);
          setBkashModalOpen(false);
          form.reset();
        } else {
          toast.error(result?.errors?.[0]?.message || "Creation failed");
        }
      } catch (error) {
        console.error("Error creating subscription:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    });
  };

  return (
    <>
      <Hero
        title={<span className="text-primary">Checkout</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]}
      />

      {/* Success Banner */}
      {paymentSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <p className="font-bold">Payment Processing</p>
          <p className="text-sm">
            Pending: Your account will be active within 24 hours
          </p>
        </div>
      )}

      <div className="bg-background py-12">
        <div className="container max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
          {/* Left */}
          <div className="w-full bg-card p-8 border rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold">Clinic Information</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Enter your clinic details to continue with your subscription
            </p>
            <hr className="my-4" />

            <div className="space-y-2 mb-4">
              <div>
                <h1 className="font-medium">Name</h1>
                <p>{session?.user?.name}</p>
              </div>
              <div>
                <h1 className="font-medium">Email</h1>
                <p>{session?.user?.email}</p>
              </div>
            </div>

            <Button
              type="button"
              className="w-full py-6 text-lg font-medium"
              onClick={() => setBkashModalOpen(true)}
            >
              Confirm and Pay
            </Button>
          </div>

          {/* Right - Summary */}
          <div className="w-full lg:max-w-sm">
            <div className="bg-card border rounded-2xl shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Subscription Summary</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your plan before completing payment
                </p>
              </div>
              <ul className="p-6 space-y-4">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{plan || "Premium"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-medium">Monthly</span>
                </li>
                <li className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{pricingPlan?.price} ৳</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              By confirming, you agree to our{" "}
              <a href="/terms-condition" className="underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* bKash Modal with form */}
      <Dialog open={bkashModalOpen} onOpenChange={setBkashModalOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-pink-600 text-white font-bold px-3 py-1 rounded-md">
                    bKash
                  </div>
                  <DialogTitle>Complete bKash Payment</DialogTitle>
                </div>
                <DialogDescription>
                  Please send money to <strong>01737813575</strong> and provide
                  your transaction details below.
                </DialogDescription>
              </DialogHeader>
              <Separator className="my-3" />

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Instructions:
                </h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
                  <li>Go to your bKash mobile menu</li>
                  <li>Select "Send Money"</li>
                  <li>
                    Enter the number: <strong>01737813575</strong>
                  </li>
                  <li>
                    Enter amount: <strong>{pricingPlan?.price} ৳</strong>
                  </li>
                  <li>Enter your PIN to confirm</li>
                  <li>Copy the Transaction ID (TrxID)</li>
                  <li>Paste the TrxID below</li>
                </ol>
              </div>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="bkashNumber"
                control={form.control}
                placeholder="01XXXXXXXXX"
                label="Your bKash Phone Number"
                type="tel"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="transactionId"
                control={form.control}
                placeholder="Enter transaction ID"
                label="Transaction ID (TrxID)"
              />

              <div className="flex gap-3 justify-end mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBkashModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Processing..." : "Submit Payment"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
