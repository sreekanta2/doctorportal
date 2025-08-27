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
import { PatientWithRelations } from "@/types";

const PatientsList = async ({
  patients,
}: {
  patients: PatientWithRelations[];
}) => {
  if (patients?.length === 0) {
    return <NotFound title="Patients not found" />;
  }
  return (
    <Table className="min-w-full whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Patient Name</TableHead>

          <TableHead>Phone </TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {patients?.map((patient: any) => (
          <TableRow key={patient.id} className="hover:bg-muted">
            <TableCell className="font-medium text-card-foreground/80">
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full">
                  <AvatarImage src={patient?.user?.image} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span className="text-base text-card-foreground">
                  {patient?.user?.name || "patient name"}
                </span>
              </div>
            </TableCell>

            <TableCell>{patient?.phoneNumber || "012451"}</TableCell>
            <TableCell>{patient?.age ? patient?.age : "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientsList;
