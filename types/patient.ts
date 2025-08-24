import { MedicalHistory } from "@prisma/client";

export interface ImageViewerState {
  isOpen: boolean;
  medicalRecords: MedicalHistory[];
  currentIndex: number;
  type: "prescription" | "report" | "";
  appointmentId: string;
}

export interface ImageViewerModalProps {
  state: ImageViewerState;
  zoomLevel: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  setZoomLevel: (value: number | ((prev: number) => number)) => void;
}
