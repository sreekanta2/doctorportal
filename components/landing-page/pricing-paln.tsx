import { CheckIcon } from "lucide-react";
import React from "react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  mostPopular?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
}

const SubscriptionPlans: React.FC = () => {
  const plans: SubscriptionPlan[] = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals getting started with basic needs",
      features: [
        { name: "5 appointments per month", included: true },
        { name: "Basic patient management", included: true },
        { name: "Email support", included: true },
        { name: "Analytics dashboard", included: false },
        { name: "Premium support", included: false },
        { name: "Unlimited appointments", included: false },
      ],
      buttonText: "Get started",
      buttonVariant: "outline",
    },
    {
      name: "Basic",
      price: "$29",
      description: "For growing practices with moderate needs",
      mostPopular: true,
      features: [
        { name: "20 appointments per month", included: true },
        { name: "Advanced patient management", included: true },
        { name: "Email & chat support", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "Premium support", included: false },
        { name: "Unlimited appointments", included: false },
      ],
      buttonText: "Upgrade now",
      buttonVariant: "primary",
    },
    {
      name: "Premium",
      price: "$99",
      description: "For established clinics with high demand",
      features: [
        { name: "Unlimited appointments", included: true },
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

  return (
    <div className="bg-card/50 py-12 sm:py-16">
      <div className="container">
        <div className=" text-center ">
          <h2 className="text-3xl font-bold tracking-tight text-default-900 sm:text-4xl">
            Flexible plans for clinics of all sizes
          </h2>
          <p className="mt-6 text-lg leading-8 text-default-600">
            Choose the perfect plan for your practice. Upgrade, downgrade, or
            cancel anytime.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={classNames(
                plan.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                planIdx === 0 ? "lg:rounded-r-none" : "",
                planIdx === plans.length - 1 ? "lg:rounded-l-none" : "",
                "flex flex-col justify-between rounded-3xl bg- p-8 ring-1 ring-default-200 xl:p-10"
              )}
            >
              <div>
                {plan.mostPopular && (
                  <p className="mb-4 text-sm font-semibold leading-6 text-indigo-600">
                    Most popular
                  </p>
                )}
                <h3
                  id={plan.name}
                  className={classNames(
                    plan.mostPopular ? "text-indigo-600" : "text-default-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-default-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-default-900">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-default-600">
                    {plan.name === "Free" ? "" : "/month"}
                  </span>
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-default-600"
                >
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex gap-x-3">
                      {feature.included ? (
                        <>
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          <span>{feature.name}</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-6 w-5 flex-none text-default-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                          <span className="text-default-400">
                            {feature.name}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                aria-describedby={plan.name}
                className={classNames(
                  plan.mostPopular
                    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                    : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                  plan.buttonVariant === "primary"
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : plan.buttonVariant === "secondary"
                    ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                  "mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                )}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default SubscriptionPlans;
