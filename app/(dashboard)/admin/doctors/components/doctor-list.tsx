"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { adminDoctorDelete } from "@/action/action.admin-doctor";
import { DoctorWithRelations } from "@/types";
import { DeleteIcon } from "lucide-react";
import { startTransition } from "react";
import toast from "react-hot-toast";
import DoctorDialogEdit from "./doctor-edit-dialog";

export default function DoctorList({
  doctors,
}: {
  doctors: DoctorWithRelations[];
}) {
  const handleDelete = (email: string) => {
    startTransition(async () => {
      try {
        const result = await adminDoctorDelete(email);
        if (result?.success) {
          toast.success("Doctor deleted successfully");
        } else {
          toast.error(result?.errors?.[0]?.message || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Doctor Name</TableHead>
            <TableHead className="font-semibold">Specialization</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors?.map((doctor) => (
            <TableRow key={doctor.id} className="hover:bg-muted">
              <TableCell className="font-medium text-card-foreground/80">
                <div className="flex items-center gap-3">
                  <Avatar className="rounded-full">
                    <AvatarImage
                      src={doctor.user?.image || "/avatars/default-doctor.jpg"}
                    />
                    <AvatarFallback>
                      {doctor.user?.name?.[0] || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{doctor.user?.name}</span>
                </div>
              </TableCell>

              <TableCell>{doctor.specialization || "N/A"}</TableCell>
              <TableCell>{doctor.hospital || "N/A"}</TableCell>

              <TableCell>
                <Rating
                  value={doctor.averageRating || 0}
                  readOnly
                  className="max-w-[100px]"
                />
              </TableCell>

              <TableCell>
                <div className="flex gap-3">
                  <DoctorDialogEdit doctor={doctor} />
                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => handleDelete(doctor?.user.email || "")}
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )} */}
    </>
  );
}
