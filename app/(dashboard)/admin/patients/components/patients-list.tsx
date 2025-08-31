"use client";

import { deleteAdminPatient } from "@/action/action.admin-doctor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientWithRelations } from "@/types";
import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";

const PatientsList = ({
  patients = [],
}: {
  patients: PatientWithRelations[];
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] =
    useState<PatientWithRelations | null>(null);

  const handleViewPatient = (patient: PatientWithRelations) => {
    setCurrentPatient(patient);
    setIsViewModalOpen(true);
  };
  const handleDeletePatient = async (email: string) => {
    const confirmed = confirm("Are you sure you want to delete this patient?");
    if (confirmed) {
      // Call the delete patient action
      const response = await deleteAdminPatient(email);
      if (response.success) {
        toast.success("Patient deleted successfully");
      } else {
        toast.error("Failed to delete patient");
      }
    }
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Patient Name</TableHead>

            <TableHead>Phone </TableHead>
            <TableHead>Age</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-muted">
              <TableCell className="font-medium text-card-foreground/80">
                <div className="flex gap-3 patients-center">
                  <Avatar className="rounded-full">
                    <AvatarImage src={patient?.user?.image || ""} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-base text-card-foreground">
                    {patient?.user?.name || "patient name"}
                  </span>
                </div>
              </TableCell>

              <TableCell>{patient?.phoneNumber}</TableCell>
              <TableCell>{patient?.age}</TableCell>

              <TableCell>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="destructive"
                    onClick={() => handleDeletePatient(patient?.user?.email)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Patient Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {currentPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentPatient?.user?.image || ""} />
                  <AvatarFallback>
                    {currentPatient?.user?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {currentPatient?.user?.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{currentPatient.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p>{currentPatient.age || "N/A"}</p>
                </div>
              </div>

              {/* Add more patient details here as needed */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientsList;
