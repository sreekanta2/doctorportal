import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NotFound } from "@/components/not-found";
import { Rating } from "@/components/ui/rating";
import { DoctorWithRelations } from "@/types";

const DoctorList = async ({ doctors }: { doctors: DoctorWithRelations[] }) => {
  if (!doctors) {
    return <NotFound title="Doctor not found" />;
  }
  return (
    <Table className="min-w-full whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Doctor Name</TableHead>

          <TableHead>Specialty</TableHead>
          <TableHead>Reviews</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {doctors?.map((doctor) => (
          <TableRow key={doctor.id} className="hover:bg-muted">
            <TableCell className="font-medium text-card-foreground/80">
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full">
                  <AvatarImage
                    src={doctor?.user?.image || "/placeholder.png"}
                  />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span className="text-base text-card-foreground">
                  {doctor?.user?.name}
                </span>
              </div>
            </TableCell>

            <TableCell>{doctor?.specialization}</TableCell>
            <TableCell className="p-0 m-0">
              <Rating value={0} readOnly className="gap-x-0.5 max-w-[100px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DoctorList;
