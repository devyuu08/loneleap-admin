import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function deleteRecommendationFromFirestore(id) {
  const ref = doc(db, "recommended_places", id);
  await deleteDoc(ref);
}
