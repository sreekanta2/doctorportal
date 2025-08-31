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
import { ClinicWithRelations } from "@/types";

const ClinicsList = async ({ clinics }: { clinics: ClinicWithRelations[] }) => {
  if (clinics?.length === 0) {
    return <NotFound title="Patients not found" />;
  }

  return (
    <Table className="min-w-full whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Clinic Name</TableHead>

          <TableHead>Phone </TableHead>
          <TableHead>Total Doctors</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {clinics?.map((clinic: any) => {
          return (
            <TableRow key={clinic?.id} className="hover:bg-muted">
              <TableCell className="font-medium text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-full">
                    <AvatarImage src={clinic?.user?.image} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-base text-card-foreground">
                    {clinic?.user?.name || "patient name"}
                  </span>
                </div>
              </TableCell>

              <TableCell>{clinic?.phoneNumber || "012451"}</TableCell>
              <TableCell>{clinic?.memberships?.length || "012451"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ClinicsList;
