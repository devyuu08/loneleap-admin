import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export async function getRecommendationDetail(id) {
  const ref = doc(db, "recommended_places", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}
