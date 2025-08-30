"use client";

import { Suspense } from "react";
import CheckoutPageContent from "./components/checkout-contenet";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
