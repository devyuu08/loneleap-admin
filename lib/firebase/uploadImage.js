import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { v4 as uuid } from "uuid";

/**
 * Firebase Storage에 이미지를 업로드하고 다운로드 URL을 반환합니다.
 *
 * 파일명을 UUID 기반으로 고유하게 설정하여 저장하며, 업로드 완료 후 접근 가능한 URL을 반환합니다.
 *
 * @param {File} file - 업로드할 이미지 파일 객체
 * @param {string} [folder="recommendations"] - 저장할 폴더 경로 (기본값: 'recommendations')
 * @returns {Promise<string>} - 업로드된 이미지의 다운로드 URL
 * @throws {Error} - 업로드 실패 시 예외 발생
 */

export async function uploadImage(file, folder = "recommendations") {
  const fileRef = ref(storage, `${folder}/${uuid()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}
