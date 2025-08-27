"use client";
import { deleteClinicReview } from "@/action/action.clinic-review";
import CustomImage from "@/components/ImageComponent";
import Pagination from "@/components/PaginationComponents";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Rating } from "@/components/ui/rating";
import { ReviewWithUser } from "@/types";
import { PaginationMeta } from "@/types/common";
import { DoctorReview } from "@prisma/client";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import ReviewForm from "./review-form"; // ✅ import the form we created for create/update

interface IReviewProps {
  reviews: ReviewWithUser[];
  pagination?: PaginationMeta;
  clinicId?: string;
}

export default function ReviewPage({
  reviews,
  pagination,
  clinicId,
}: IReviewProps) {
  const user = useSession();
  const [isPending, startTransition] = useTransition();

  // Track which review is being edited
  const [editingReview, setEditingReview] = useState<DoctorReview | null>(null);

  const onEdit = (review: DoctorReview) => {
    setEditingReview(review);
  };

  const onDelete = (reviewId: string) => {
    startTransition(async () => {
      try {
        const result = await deleteClinicReview(reviewId);
        if (result?.success) {
          toast.success("Review deleted");
          // TODO: trigger re-fetch or filter locally
        } else {
          toast.error(
            result?.errors?.[0]?.message || "Failed to delete review"
          );
        }
      } catch (err) {
        toast.error("Error deleting review");
      }
    });
  };

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      {reviews?.length > 0 && (
        <header>
          <h1
            id="reviews-heading"
            className="text-2xl font-semibold text-default-800"
          >
            Patient Reviews
          </h1>
        </header>
      )}

      {/* ✅ Render Edit Form when editing */}
      {editingReview && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Edit Review</h2>
          <ReviewForm
            clinicId={clinicId}
            review={editingReview}
            setEditingReview={setEditingReview}
          />
          <Button
            variant="ghost"
            color="destructive"
            onClick={() => setEditingReview(null)}
            className="mt-2 text-sm text-gray-500 hover:underline"
          >
            Cancel
          </Button>
        </div>
      )}

      {reviews?.length > 0 && (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <article
              key={review.id}
              className="bg-card rounded-lg shadow-sm border overflow-hidden"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="p-4 pb-0 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <figure className="flex-shrink-0">
                    {review?.reviewer?.image ? (
                      <CustomImage
                        src={review?.reviewer?.image || ""}
                        alt={`${
                          review?.reviewer?.name || "Anonymous"
                        } profile picture`}
                        aspectRatio="1/1"
                        className="rounded-full"
                        containerClass="w-12 h-12"
                        itemProp="author"
                      />
                    ) : (
                      <div className="w-12 h-12 border rounded-full p-2">
                        <User />
                      </div>
                    )}
                  </figure>
                  <div>
                    <h2
                      className="text-lg font-semibold text-default-500"
                      itemProp="name"
                    >
                      {review?.reviewer?.name || "Anonymous"}
                    </h2>
                    <time
                      className="text-base text-default-500"
                      itemProp="datePublished"
                    >
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>

                {/* Rating & Actions */}
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
                  {user?.data?.user?.id === review?.reviewerId && (
                    <div className="flex flex-col gap-4 md:pt-2 items-end justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(review)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive-700"
                            onClick={() => onDelete(review.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-destructive-700" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  <meta
                    itemProp="ratingValue"
                    content={review?.rating.toString()}
                  />
                  <meta itemProp="bestRating" content="5" />
                </div>
              </div>

              <div className="p-4 ml-16">
                <p className="text-default-500 text-sm" itemProp="reviewBody">
                  {review?.comment}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && (
        <nav className="mt-24" aria-label="Pagination navigation">
          {pagination?.total > pagination?.limit && (
            <Pagination
              currentPage={pagination?.page}
              totalPages={pagination?.totalPages}
            />
          )}
        </nav>
      )}
      {!editingReview && <ReviewForm clinicId={clinicId} />}
    </section>
  );
}
