"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Icon } from "@iconify/react";
import { useState } from "react";

const PatientsList = ({ patients = [] }: { patients: any }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);

  const handleViewPatient = (patient: any) => {
    setCurrentPatient(patient);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Patient Name</TableHead>

            <TableHead>Phone </TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient: any) => (
            <TableRow key={patient.id} className="hover:bg-muted">
              <TableCell className="font-medium text-card-foreground/80">
                <div className="flex gap-3 patients-center">
                  <Avatar className="rounded-full">
                    <AvatarImage src={patient.image} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-base text-card-foreground">
                    {patient.name}
                  </span>
                </div>
              </TableCell>

              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>
                {patient.lastVisit ? patient.lastVisit : "N/A"}
              </TableCell>

              <TableCell>
                <Badge
                  variant="soft"
                  color={(patient?.isActive && "success") || "destructive"}
                  className=" capitalize"
                >
                  {patient?.isActive ? "active" : "inactive"}
                </Badge>
              </TableCell>

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
                  <AvatarImage src={currentPatient.image} />
                  <AvatarFallback>
                    {currentPatient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{currentPatient.name}</h3>
                  <Badge
                    variant="soft"
                    color={
                      (currentPatient?.isActive && "success") || "destructive"
                    }
                    className="mt-1 capitalize"
                  >
                    {currentPatient?.isActive ? "active" : "inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{currentPatient.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Visit</Label>
                  <p>{currentPatient.lastVisit || "N/A"}</p>
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
