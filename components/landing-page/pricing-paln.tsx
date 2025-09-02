"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DBPlan = {
  id: string;
  plan: string;
  price: number;
  maxDoctors: number | null;
};

export default function PlansPage() {
  const [pricingPlans, setPricingPlans] = useState<DBPlan[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch("/api/pricing-plan");
      const data = await res.json();
      setPricingPlans(data?.data || []);
    };
    fetchPlan();
  }, []);

  const handleChoosePlan = (planName: string) => {
    router.push(`/checkout?plan=${planName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
        Choose Your Subscription
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
        Scale your clinic with flexible plans. Whether you’re just starting out
        or running a large healthcare center, we have a plan for you.
      </p>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2   gap-8">
        {pricingPlans.map((plan, index) => {
          const isPopular =
            plan.plan === "BASIC" || plan.plan === "PROFESSIONAL";

          return (
            <div
              key={plan.id}
              className={`relative border rounded-2xl p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 ${
                isPopular
                  ? "border-primary-500 ring-2 ring-primary-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {plan.plan}
                </h2>
                <p className="text-center text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                  {plan.price} ৳
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                    /month
                  </span>
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    ✅{" "}
                    {plan.maxDoctors
                      ? `Add up to ${plan.maxDoctors} doctors`
                      : "Unlimited doctors"}
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Patient management
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Basic analytics dashboard
                  </li>
                  {plan.plan === "PREMIUM" && (
                    <>
                      <li className="flex items-center gap-2">
                        ✅ Custom branding
                      </li>
                      <li className="flex items-center gap-2">✅ API access</li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleChoosePlan(plan.plan)}
                className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all ${
                  isPopular
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Choose {plan.plan}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
