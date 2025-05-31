import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function addRecommendationToFirestore(formData, imageUrl) {
  const {
    name,
    summary,
    location,
    description,
    visible,
    locationInfo,
    directions,
    nearbyInfo,
  } = formData;

  const docRef = await addDoc(collection(db, "recommended_places"), {
    name,
    summary,
    location,
    description,
    imageUrl,
    visible,
    locationInfo,
    directions: directions ?? [],
    nearbyInfo: nearbyInfo ?? [],
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
