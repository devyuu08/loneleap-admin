import { useState } from "react";
import { uploadImage } from "@/lib/uploadImage";

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file, folder = "recommendations") => {
    setUploading(true);
    setError(null);
    try {
      return await uploadImage(file, folder);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      setError(err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage: upload, uploading, error };
}
