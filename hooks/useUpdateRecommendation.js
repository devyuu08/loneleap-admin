import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export const useUpdateRecommendation = () => {
  const updateRecommendation = async (id, data) => {
    const ref = doc(db, "recommended_places", id);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  return { updateRecommendation };
};
