import CustomImage from "@/components/ImageComponent";
import Pagination from "@/components/PaginationComponents";
import { Rating } from "@/components/ui/rating";

interface IReviewProps {
  reviews: any;
}

export default function ReviewPage({ reviews }: IReviewProps) {
  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <header>
        <h1
          id="reviews-heading"
          className="text-2xl font-semibold text-default-800"
        >
          Patient Reviews{" "}
          <span className="text-primary-600">({reviews?.length || 0})</span>
        </h1>
      </header>

      {reviews?.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <article
              key={review.id}
              className="bg-card rounded-lg shadow-sm border overflow-hidden"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="p-4 pb-0 flex flex-col sm:flex-row justify-between gap-4 ">
                <div className="flex gap-4 items-start">
                  <figure className="flex-shrink-0">
                    <CustomImage
                      src={review?.patient?.image}
                      alt={`${
                        review?.patient?.name || "Patient"
                      } profile picture`}
                      aspectRatio="1/1"
                      className="rounded-full"
                      containerClass="w-12 h-12"
                      itemProp="author"
                    />
                  </figure>
                  <div>
                    <h2
                      className="text-lg font-semibold text-default-700"
                      itemProp="name"
                    >
                      {review?.patient?.name || "Anonymous"}
                    </h2>
                    <time
                      dateTime={review.createdAt}
                      className="text-base text-default-500"
                      itemProp="datePublished"
                    >
                      {new Date("2025-01-15T10:00:00.000Z").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                </div>
                <div
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <Rating
                    value={review?.rating}
                    readOnly
                    className="gap-x-1.5 max-w-[125px]"
                    aria-label={`Rated ${review?.rating} out of 5 stars`}
                  />
                  <meta
                    itemProp="ratingValue"
                    content={review?.rating.toString()}
                  />
                  <meta itemProp="bestRating" content="5" />
                </div>
              </div>

              <div className="p-4">
                <p className="text-default-700" itemProp="reviewBody">
                  {review?.comment}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border p-6 text-center">
          <p className="text-default-600">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      )}

      {reviews?.length > 1 && (
        <footer className="pt-4">
          <Pagination
            currentPage={1}
            totalPages={Math.ceil(reviews.length / 5)} // Assuming 5 items per page
            aria-label="Reviews pagination"
          />
        </footer>
      )}
    </section>
  );
}
