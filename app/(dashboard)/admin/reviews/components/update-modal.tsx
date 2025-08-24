"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface UpdateReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
  onUpdate: (updatedReview: any) => void;
}

export default function UpdateReviewDialog({
  isOpen,
  onClose,
  review,
  onUpdate,
}: UpdateReviewDialogProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setContent(review.content || "");
      setRating(review.rating || 0);
      setStatus(review.status || "pending");
    }
  }, [review]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/reviews/${review.id}`, {
        content,
        rating,
        status,
      });
      onUpdate(res.data);
      toast.success("Review updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update the review details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            {/* <Rating value={rating} onValueChange={(v) => setRating(v)} /> */}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              value={content}
              //   onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
