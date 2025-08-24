"use client";
import Pagination from "@/components/PaginationComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteClinic } from "@/action/action.clinics";
import { ClinicWithRelations } from "@/types";
import { DeleteIcon } from "lucide-react";
import { startTransition } from "react";
import toast from "react-hot-toast";
import ClinicEditDialog from "./clinic-edit-dialog";

export default function ClinicList({
  clinics,
  pagination,
}: {
  clinics: ClinicWithRelations[];
  pagination: {
    page: number;
    totalPages: number;
  };
}) {
  const handleDelete = (email: string) => {
    startTransition(async () => {
      try {
        const result = await deleteClinic(email);

        if (result?.success) {
          toast.success("clinic deleted successfully");
        } else {
          toast.error(result?.message || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting clinic:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Clinic Name</TableHead>
            <TableHead className="font-semibold">Booking phone</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clinics?.length > 0 &&
            clinics?.map((clinic) => (
              <TableRow key={clinic.id} className="hover:bg-muted">
                <TableCell className="font-medium text-card-foreground/80">
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-full">
                      <AvatarImage
                        src={
                          clinic.user?.image || "/avatars/default-clinic.jpg"
                        }
                      />
                      <AvatarFallback>
                        {clinic.user?.name?.[0] || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{clinic.user?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{clinic?.phoneNumber}</TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <ClinicEditDialog clinic={clinic} />
                    <Button
                      size="icon"
                      variant="outline"
                      color="destructive"
                      className="h-7 w-7"
                      onClick={() => handleDelete(clinic?.user?.email || "")}
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  );
}
