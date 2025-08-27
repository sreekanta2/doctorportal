// components/PatientProfile/PastAppointmentCard.tsx
"use client";

import { avatar } from "@/config/site";
import { MedicalHistoryWithRelations } from "@/types";
import { MedicalHistory } from "@prisma/client";
import { Calendar, FileText, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageViewerModal } from "../../../../../components/image-view-modal";
import MedicalRecordsAddDialog from "./medical-records-add-dialog";

export const PastAppointmentCard = ({
  medicalRecords,
}: {
  medicalRecords: MedicalHistoryWithRelations;
}) => {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    medicalRecords: medicalRecords?.medicalHistory || [],
    currentIndex: 0,
    type: "" as "prescription" | "report",
    appointmentId: "",
  });

  const [zoomLevel, setZoomLevel] = useState(1);

  const openImageViewer = (
    medicalRecords: MedicalHistory[],
    type: "prescription",
    appointmentId: string
  ) => {
    setViewerState({
      isOpen: true,
      medicalRecords: medicalRecords,
      currentIndex: 0,
      type,
      appointmentId,
    });
    setZoomLevel(1);
  };

  const closeImageViewer = () => {
    setViewerState((prev) => ({ ...prev, isOpen: false }));
  };

  const nextImage = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.medicalRecords.length,
    }));
    setZoomLevel(1);
  };

  const prevImage = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + prev.medicalRecords.length) %
        prev.medicalRecords.length,
    }));
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));

  useEffect(() => {
    if (!viewerState.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "+":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "Escape":
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerState.isOpen]);

  return (
    <>
      <div
        key={1}
        className="p-4  bg-card/70 rounded-md border-gray-200
      dark:border-gray-700 last:border-0 hover:bg-gray-50
      dark:hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-18 w-18 flex-shrink-0">
              <Image
                src={medicalRecords.doctor?.user?.image || avatar}
                alt="doctor"
                width={72}
                height={72}
                className="rounded-full border-2 border-white dark:border-gray-700 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
                <Stethoscope className="w-3 h-3 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div>
              <Link
                href={`/doctors/${medicalRecords?.doctor?.id}`}
                className="font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {medicalRecords?.doctor?.user?.name}
              </Link>
              <p className="text-base text-gray-600 dark:text-gray-300">
                {medicalRecords?.doctor?.specialization}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>
                  Booking Date •{" "}
                  {new Date(medicalRecords?.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t pt-4 md:border-t-0 md:pt-0">
            <MedicalRecordsAddDialog doctorId={medicalRecords?.doctor?.id} />
            <button
              onClick={() =>
                medicalRecords?.medicalHistory?.length > 0 &&
                openImageViewer(
                  medicalRecords.medicalHistory,
                  "prescription",
                  medicalRecords.id
                )
              }
              className="flex items-center gap-1 px-3 py-1.5 text-base bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>
      </div>
      {viewerState.isOpen && (
        <ImageViewerModal
          state={viewerState}
          zoomLevel={zoomLevel}
          onClose={closeImageViewer}
          onNext={nextImage}
          onPrev={prevImage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          setZoomLevel={setZoomLevel}
        />
      )}
    </>
  );
};
