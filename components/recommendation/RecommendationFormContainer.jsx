import { useEffect, useState } from "react";
import RecommendationForm from "@/components/recommendation/RecommendationForm";

export default function RecommendationFormContainer({
  onSubmit,
  loading,
  initialValues,
}) {
  const [form, setForm] = useState({
    name: "",
    summary: "",
    location: "",
    description: "",
    imageFile: null,
    imagePreview: null,
    visible: true,
    locationInfo: "",
    direction: "",
    nearby: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        summary: initialValues.summary || "",
        location: initialValues.location || "",
        description: initialValues.description || "",
        imageFile: null,
        imagePreview: initialValues.imageUrl || null,
        visible: initialValues.visible ?? true,
        locationInfo: initialValues.locationInfo || "",
        direction: (initialValues.directions || []).join("\n"),
        nearby: (initialValues.nearbyInfo || []).join("\n"),
      });
      setIsInitialized(true);
    } else {
      setIsInitialized(true); // 값이 없더라도 초기화는 완료됨
    }
  }, [initialValues]);

  if (!isInitialized) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, location, description, imageFile, imagePreview } = form;

    if (!name || !location || !description || (!imageFile && !imagePreview)) {
      return alert("필수 항목을 모두 입력하세요.");
    }

    await onSubmit({
      ...form,
      directions: form.direction.split("\n").filter((l) => l.trim()),
      nearbyInfo: form.nearby.split("\n").filter((l) => l.trim()),
    });
  };
  return (
    <RecommendationForm
      form={form}
      onChange={handleChange}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
      loading={loading}
      isEdit={!!initialValues}
    />
  );
}
