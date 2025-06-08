import { useCallback, useState } from "react";
import { uploadImage } from "@/lib/firebase/uploadImage";

/**
 * 이미지 업로드 훅
 * - Firebase Storage에 이미지 파일을 업로드하고 URL을 반환
 * - 업로드 중 상태(uploading), 에러 상태(error) 제공
 *
 * @returns {{
 *   uploadImage: (file: File, folder?: string) => Promise<string | null>,
 *   uploading: boolean,
 *   error: Error | null
 * }}
 */

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, folder = "recommendations") => {
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
  }, []);

  return { uploadImage: upload, uploading, error };
}
