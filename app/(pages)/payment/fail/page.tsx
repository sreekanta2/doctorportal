import Link from "next/link";

export default function FailPage({
  searchParams,
}: {
  searchParams: { tran_id?: string | null; plan?: string | null };
}) {
  const tran_id = searchParams?.tran_id || null;
  const plan = searchParams?.plan || null;
  console.log(tran_id, plan);
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg
              className="w-8 h-8 text-red-600"
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
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-gray-600 mt-2">
          Unfortunately, your payment could not be processed.
        </p>

        {/* Transaction ID */}
        {tran_id && (
          <p className="mt-4 text-sm text-gray-500">
            Transaction ID: <span className="font-medium">{tran_id}</span>
          </p>
        )}

        {/* Retry button */}
        <div className="mt-6">
          <Link
            href={`/checkout?plan=${plan}`}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
