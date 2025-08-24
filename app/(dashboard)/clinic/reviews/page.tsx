import CustomImage from "@/components/ImageComponent";
import LimitSelect from "@/components/limit-select";
import Pagination from "@/components/PaginationComponents";
import { Rating } from "@/components/ui/rating";

export default async function ReviewsPageView({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // If searchParams is a plain object, get the page param
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "5", 10);

  // Fetch doctors data based on page and limit
  // const reviewsResponse = await getReviews({ page, limit });
  const reviewsResponse: any = [];
  return (
    <div className="space-y-6  bg-card/70  rounded-md">
      <h1 className="text-xl font-semibold border-b p-4">Reviews</h1>

      <div className="space-y-4 p-4 ">
        <div className="flex justify-between p-6 border rounded-md bg-card">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Overall Rating</h2>

            <div className="flex gap-4 items-center">
              <span className="text-3xl text-default-700">4.0</span>
              <Rating
                value={4.5}
                readOnly
                className="gap-x-1.5 max-w-[125px]"
              />
            </div>
          </div>
          <LimitSelect />
        </div>

        {reviewsResponse?.data?.length > 0 &&
          reviewsResponse?.data.map((review: any) => (
            <div className=" border bg-card rounded-md " key={review.id}>
              <div className=" p-4  flex justify-between items-center border-b">
                <div className="flex gap-4 items-start ">
                  <CustomImage
                    src={review.patient.avatar}
                    alt="avatar"
                    aspectRatio="1/1"
                    containerClass="w-12 h-12"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-base lg:text-lg text-default-700">
                      {review.patient.name}
                    </h3>
                    <p className="text-base text-default-600">2023-04-15</p>
                  </div>
                </div>
                <Rating
                  value={review?.rating}
                  readOnly
                  className="gap-x-1.5 max-w-[125px]"
                />
              </div>

              <p className="p-4">{review?.content}</p>
            </div>
          ))}

        {/* Pagination Component */}
        {reviewsResponse?.pagination?.totalRecords >
          reviewsResponse?.pagination?.perPage && (
          <div className="mt-24">
            <Pagination
              currentPage={reviewsResponse?.pagination?.currentPage}
              totalPages={reviewsResponse?.pagination?.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
