"use client";

import { CheckCircle, Loader2, Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FileInputProps {
  setImages: (urls: string[]) => void;
  images: string[];
  label?: string;
  maxFiles?: number;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

const FileInput: React.FC<FileInputProps> = ({
  setImages,
  images,
  label,
  maxFiles = 1,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetStateOnError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
    setIsLoading(false);
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Reset messages before starting new file selection
    setSuccess(null);
    setError(null);

    // Check if selecting more files exceeds maxFiles limit
    if (files?.length + images?.length > maxFiles) {
      resetStateOnError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setIsLoading(true);

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // File validation
      if (file.size > MAX_FILE_SIZE) {
        resetStateOnError("File is too large. Maximum size is 2MB.");
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        resetStateOnError(
          "Invalid file type. Only PNG, JPEG, and SVG are allowed."
        );
        return;
      }

      try {
        // Simulate file upload and getting the URL
        const fileUrl = URL.createObjectURL(file);
        newImages.push(fileUrl);
      } catch {
        resetStateOnError("Error uploading file.");
        return;
      }
    }

    // Set new images on successful upload
    setImages([...images, ...newImages]);
    setSuccess("Files uploaded successfully.");
    setIsLoading(false);
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = async (urlToRemove: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate file removal from server
      const response = await fetch(
        `/api/remove?fileName=${encodeURIComponent(
          urlToRemove.split("/").pop()!
        )}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setImages(images.filter((url) => url !== urlToRemove));
        setSuccess(data.message || "File removed successfully.");
      } else {
        setError(data.message || "File removal failed.");
      }
    } catch {
      setError("An unexpected error occurred during file removal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <label>{label}</label>}

      <div className="flex items-center gap-2">
        <Label>
          <Button asChild>
            <div>
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </div>
          </Button>
          <Input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
          />
        </Label>

        {isLoading && (
          <Loader2 className="animate-spin text-blue-500" size={24} />
        )}
        {success && <CheckCircle className="text-green-500" size={24} />}
        {error && <XCircle className="text-red-500" size={24} />}
      </div>

      <div className="flex flex-wrap gap-2 mt-2 items-center">
        {images.length !== 0 &&
          success &&
          images.map((url, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleRemoveFile(url)}
                className="text-destructive"
              >
                Remove
              </button>
            </div>
          ))}
        {!success && !error && (
          <p className="flex flex-wrap">
            Your Image should be below 2 MB, Accepted formats: jpg, png, svg
          </p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
