"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Feature = { name: string; included: boolean };
type SubscriptionPlan = {
  name: string;
  price: string;
  description: string;
  mostPopular?: boolean;
  features: Feature[];
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
};

const plans: SubscriptionPlan[] = [
  {
    name: "BASIC",
    price: "1500 ৳",
    description:
      "Grow your clinic — add more doctors and enhance patient management.",
    mostPopular: true,
    features: [
      { name: "Add up to 10 doctors per month", included: true },
      { name: "Advanced patient management", included: true },
      { name: "Email & chat support", included: true },
      { name: "Basic analytics dashboard", included: true },
      { name: "Priority support", included: false },
      { name: "Unlimited appointments", included: false },
    ],
    buttonText: "Upgrade Now",
    buttonVariant: "primary",
  },
  {
    name: "PREMIUM",
    price: "2900 ৳",
    description:
      "For established clinics — unlimited doctor additions and full management features.",
    features: [
      { name: "Add unlimited doctors per month", included: true },
      { name: "Full patient management suite", included: true },
      { name: "Priority email, chat & phone support", included: true },
      { name: "Advanced analytics dashboard", included: true },
      { name: "Custom branding", included: true },
      { name: "API access", included: true },
    ],
    buttonText: "Get Premium",
    buttonVariant: "secondary",
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const handleChoosePlan = (planName: string) => {
    setSelectedPlan(planName);
    // Example: Navigate to checkout page with the plan name
    router.push(`/checkout?plan=${planName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Clinic Subscription Plan
      </h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border rounded-xl p-6 flex flex-col justify-between shadow hover:shadow-lg transition-all duration-300 ${
              plan.mostPopular
                ? "border-primary-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.mostPopular && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              {plan.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {plan.description}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {plan.price}
            </p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  {feature.included ? (
                    <span className="text-green-500">✔</span>
                  ) : (
                    <span className="text-red-500">✖</span>
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>

            {plan?.buttonText && (
              <button
                onClick={() => handleChoosePlan(plan.name)}
                className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
                  plan.buttonVariant === "primary"
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : plan.buttonVariant === "secondary"
                    ? "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                    : "border border-primary-500 text-primary-500 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-400"
                }`}
              >
                {plan.buttonText}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
