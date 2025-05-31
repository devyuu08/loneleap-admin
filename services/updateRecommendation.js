import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function updateRecommendationInFirestore(id, data) {
  const ref = doc(db, "recommended_places", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
