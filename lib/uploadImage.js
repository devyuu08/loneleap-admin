import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { v4 as uuid } from "uuid";

export async function uploadImage(file, folder = "recommendations") {
  const fileRef = ref(storage, `${folder}/${uuid()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}
