"use client";
import Pagination from "@/components/PaginationComponents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteSpecialization } from "@/action/action.specialties";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types/common";
import { Specialization } from "@prisma/client";
import { Trash } from "lucide-react";
import { startTransition } from "react";
import toast from "react-hot-toast";
import SpecialtiesCreateDialog from "./create-dialog";

export default function SpecialtiesList({
  specialties,
  pagination,
}: {
  specialties: Specialization[];
  pagination: PaginationMeta;
}) {
  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteSpecialization(id);

        if (result?.success) {
          toast.success("Specialization deleted successfully");
        } else {
          toast.error(result?.message || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting specialization:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Specialty</TableHead>
            <TableHead className="font-semibold">Total Doctors</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {specialties?.length > 0 &&
            specialties?.map((specialty) => (
              <TableRow key={specialty.id} className="hover:bg-muted">
                <TableCell>{specialty.name}</TableCell>
                <TableCell>{specialty.totalDoctors}</TableCell>
                <TableCell className="flex gap-4 items-center">
                  <Button
                    size="icon"
                    variant="soft"
                    color="destructive"
                    onClick={() => handleDelete(specialty.id)}
                  >
                    <Trash size={16} />
                  </Button>
                  <SpecialtiesCreateDialog specialty={specialty} />
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
