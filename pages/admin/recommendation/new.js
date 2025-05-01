import React from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import RecommendationForm from "@/components/recommendation/RecommendationForm";

export default function NewRecommendationPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="py-10">
          <RecommendationForm />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
