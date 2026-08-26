import React from "react";
import { isValidUrl } from "@/app/components/utils/catogaries";
interface ImagePreviewProps {
  url: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ url }) => {
  const trimmedUrl = url.trim();
  if (!isValidUrl(trimmedUrl)) return null;

  return (
    <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
      <img src={trimmedUrl}  alt="Image preview"className="w-12 h-12 object-cover rounded" />
      <span className="text-xs text-gray-500">Image preview</span>
    </div>
  );
};