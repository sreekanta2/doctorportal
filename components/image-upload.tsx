"use client";

import { deleteImage, uploadImage } from "@/action/action.image-upload";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

interface ImageUploadProps {
  setImage: (url: string | null) => void;
  initialImage?: string | "";
  medicalRecordId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  setImage,
  initialImage = null,
  medicalRecordId,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(initialImage);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSession();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP files are allowed.");
      return;
    }
    if (file.size > maxSize) {
      setError("File size must not exceed 3MB.");
      return;
    }

    setError(null);

    setLoading(true);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImage(formData);

      setUploadProgress(100);

      // Small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 200));
      setPreview(result.url);
      setImage(result.url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!preview) throw new Error("No image to delete");
      if (!user?.data?.user?.email) throw new Error("User email not found");

      // Call server action
      await deleteImage({
        email: user.data.user.email,
        imagePath: preview,
        medicalRecordId,
      });

      // Reset image state after successful delete
      setImage(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      setError(err.message || "Failed to delete image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center ">
      {/* Preview Section */}
      <div
        className={`relative w-40 h-40 rounded-lg overflow-hidden ${
          !preview ? "border-2 border-dashed" : "border"
        } border-gray-300 flex items-center justify-center`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Circular progress bar */}
            <div className="relative w-16 h-16">
              <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div
                className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin"
                style={{
                  borderRightColor: "transparent",
                  borderBottomColor: "transparent",
                  transform: `rotate(${uploadProgress * 3.6}deg)`,
                }}
              ></div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Loading...</p>
              <p className="text-xs text-gray-500">{uploadProgress}%</p>
            </div>
          </div>
        ) : preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600">No image selected</p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP up to 3MB
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </>
          ) : preview ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Change</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Upload Image</span>
            </>
          )}
        </button>

        {preview && !loading && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm max-w-xs">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {uploadProgress === 100 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Upload successful!</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
