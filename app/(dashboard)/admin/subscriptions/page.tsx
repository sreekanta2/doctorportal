import LimitSelect from "@/components/limit-select";
import Pagination from "@/components/PaginationComponents";
import SearchInput from "@/components/SearchInput";
import { getAllSubscriptions } from "@/config/subscriptions";
import SubscriptionsList from "./components/subscriptions-list";

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;

  // Fetch doctors data based on page and limit
  const subscriptionResponse = await getAllSubscriptions({
    page,
    limit,
    search,
  });
  const subscriptions = subscriptionResponse.data;
  const pagination = subscriptionResponse.meta?.pagination;

  return (
    <div className="border p-6 bg-card rounded-md space-y-4">
      <h1 className="text-2xl font-bold   bg-card/50 text-default-600   ">
        Subscriptions List
      </h1>
      <hr />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <SearchInput searchParamKey="search" />
        <LimitSelect />
      </div>

      <SubscriptionsList subscriptions={subscriptions} />

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  );
}
