export default function CancelPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tran_id = (searchParams?.id as string) || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        {/* Message */}
        <p className="mt-2 text-gray-600">
          {tran_id
            ? `Your payment with Transaction ID ${tran_id} was cancelled.`
            : "Your payment was cancelled before completion."}
        </p>

        {/* Action */}
        <div className="mt-6">
          <a
            href="/checkout"
            className="inline-block rounded-lg bg-red-600 px-6 py-3 text-white font-medium shadow hover:bg-red-700 transition"
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}
