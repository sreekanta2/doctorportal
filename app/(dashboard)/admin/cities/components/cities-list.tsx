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

import { deleteCity } from "@/action/action.city";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types/common";
import { City } from "@prisma/client";
import { Trash } from "lucide-react";
import { startTransition } from "react";
import toast from "react-hot-toast";
import CityCreateDialog from "./create-dialog";

export default function CitiesPageList({
  cities,
  pagination,
}: {
  cities: City[];
  pagination: PaginationMeta;
}) {
  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteCity(id);

        if (result?.success) {
          toast.success("City deleted successfully");
        } else {
          toast.error(result?.message || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting city:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">City</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cities?.length > 0 &&
            cities?.map((city) => (
              <TableRow key={city.id} className="hover:bg-muted">
                <TableCell>{city.name}</TableCell>

                <TableCell className="flex gap-4 items-center">
                  <Button
                    size="icon"
                    variant="soft"
                    color="destructive"
                    onClick={() => handleDelete(city.id)}
                  >
                    <Trash size={16} />
                  </Button>
                  <CityCreateDialog city={city} />
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
