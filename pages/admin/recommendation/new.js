import React from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import RecommendationForm from "@/components/recommendation/RecommendationForm";
import { useAddRecommendation } from "@/hooks/useAddRecommendation";

export default function NewRecommendationPage() {
  const { addRecommendation, loading } = useAddRecommendation();

  const handleSubmit = async (formData) => {
    await addRecommendation(formData);
    // 성공 후 이동 또는 알림
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="py-10">
          <RecommendationForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
