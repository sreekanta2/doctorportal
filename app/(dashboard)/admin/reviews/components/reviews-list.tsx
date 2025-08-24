"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { avatar } from "@/config/site";
import { Icon } from "@iconify/react";
import { useState } from "react";
import UpdateReviewModal from "./update-modal";

export default function ReviewsList({ reviews = [] }: { reviews: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [reviewList, setReviewList] = useState(reviews);

  const handleOpenModal = (review: any) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  const handleUpdateReview = (updatedReview: any) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
  };

  return (
    <>
      <Table className="w-[1250px]">
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reviewList.map((review) => (
            <TableRow key={review.id} className="hover:bg-muted">
              <TableCell>
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={review?.patient?.avatar || avatar} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  {review?.patient?.name || "Patient"}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={review?.doctor?.avatar || avatar} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  {review?.doctor?.name || "Doctor"}
                </div>
              </TableCell>

              <TableCell>
                <Rating
                  value={review.rating || 0}
                  readOnly
                  className="max-w-[100px]"
                />
              </TableCell>

              <TableCell>
                {review.content?.length > 42
                  ? review.content.slice(0, 42) + "..."
                  : review.content}
              </TableCell>
              <TableCell>
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="soft"
                  color={
                    review.status === "approved"
                      ? "default"
                      : review.status === "rejected"
                      ? "destructive"
                      : review.status === "pending"
                      ? "warning"
                      : "default"
                  }
                >
                  {review.status || "status"}
                </Badge>
              </TableCell>

              <TableCell className="flex gap-2 justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleOpenModal(review)}
                >
                  <Icon icon="heroicons:pencil" className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedReview && (
        <UpdateReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          review={selectedReview}
          onUpdate={handleUpdateReview}
        />
      )}
    </>
  );
}
