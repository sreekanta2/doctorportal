import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment has been processed successfully.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
