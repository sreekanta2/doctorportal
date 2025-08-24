// components/PatientProfile/ImageViewerModal.tsx
import { deleteMedicalHistory } from "@/action/action.medical-history";
import MedicalRecordsUpdateDialog from "@/app/(dashboard)/patient/dashboard/components/medical-records-edit-dialog";
import { useSidebar } from "@/store";
import { ImageViewerModalProps } from "@/types/patient";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  Trash,
  XIcon,
} from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const ImageViewerModal = ({
  state,
  zoomLevel,
  onClose,
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut,
  setZoomLevel,
}: ImageViewerModalProps) => {
  const { medicalRecords, currentIndex } = state;

  const currentImage = medicalRecords[currentIndex];
  const { collapsed } = useSidebar();

  // Drag state management
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset position when image changes or zoom resets
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, zoomLevel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imageRef.current.getBoundingClientRect();

      const maxX = Math.max(0, (imgRect.width - containerRect.width) / 2);
      const maxY = Math.max(0, (imgRect.height - containerRect.height) / 2);

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault();
    const delta = e.deltaY;
    const zoomStep = 0.1;

    if (delta > 0 && zoomLevel > 0.5) {
      setZoomLevel((prev) => Math.max(0.5, prev - zoomStep));
    } else if (delta < 0 && zoomLevel < 3) {
      setZoomLevel((prev) => Math.min(3, prev + zoomStep));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);
  const getDownloadUrl = (url: string) => {
    try {
      const cloudUrl = new URL(url);
      cloudUrl.pathname = cloudUrl.pathname.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      return cloudUrl.toString();
    } catch {
      return url;
    }
  };
  const handleMedicalHistoryDelete = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteMedicalHistory(id);

        if (result?.success) {
          toast.success("Medical history deleted successfully");
        } else {
          toast.error(result?.errors?.[0]?.message || "Creation failed");
        }
      } catch (error) {
        console.error("Error saving doctor:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 ${
        collapsed ? "md:ml-16" : "md:ml-64"
      }`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Info and Controls */}
      <div className="bg-gray-900/80 absolute top-0 z-10 w-[98%] text-white p-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-medium">
            {medicalRecords?.[currentIndex]?.title}
          </h3>
          <p className="text-base text-gray-300">
            Image {currentIndex + 1} of {medicalRecords?.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-gray-700 transition-colors"
              disabled={zoomLevel <= 0.5}
            >
              <MinusIcon className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 text-base">
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-gray-700 transition-colors"
              disabled={zoomLevel >= 3}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <a
            href={
              currentImage?.document
                ? getDownloadUrl(currentImage.document)
                : "#"
            }
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
          </a>
          <button
            className="p-2 bg-gray-800 text-destructive-700 rounded-full hover:bg-gray-700 transition-colors"
            onClick={() => handleMedicalHistoryDelete(currentImage?.id)}
          >
            <Trash className="w-6 h-6" />
          </button>
          <MedicalRecordsUpdateDialog medicalHistory={currentImage} />
          <button
            onClick={onClose}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="relative w-full max-w-6xl h-full flex flex-col">
        {medicalRecords?.length > 1 && (
          <>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
              <button
                onClick={onPrev}
                className="p-3 rounded-full bg-white/80 text-gray-800 hover:bg-white"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
              <button
                onClick={onNext}
                className="p-3 rounded-full bg-white/80 text-gray-800 hover:bg-white"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        )}

        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{
            cursor:
              zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <img
            ref={imageRef}
            src={currentImage?.document || ""}
            alt={` image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? "none" : "transform 0.3s",
            }}
            draggable="false"
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </div>
  );
};
