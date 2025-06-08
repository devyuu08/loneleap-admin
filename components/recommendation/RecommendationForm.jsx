import React from "react";
import FormInput from "@/components/common/form/FormInput";
import FormTextarea from "@/components/common/form/FormTextarea";
import FormSelect from "@/components/common/form/FormSelect";
import FormSubmitButton from "@/components/common/button/FormSubmitButton";

/**
 * RecommendationForm
 * - 추천 여행지 생성/수정 폼
 * - 입력 상태(form), 이미지 변경, 제출 핸들러를 props로 받아 처리
 * - 생성과 수정은 isEdit 여부로 분기 렌더링
 * - 시맨틱 구조를 고려해 섹션 및 필드셋을 명확히 구분함
 */

function RecommendationForm({
  form,
  onChange,
  onImageChange,
  onSubmit,
  loading,
  isEdit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-screen-lg mx-auto px-10 py-16 space-y-16"
    >
      {/* 1. 기본 정보 + 이미지 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <fieldset className="space-y-6">
          <legend className="sr-only">기본 정보 입력</legend>

          <FormInput
            label="장소명"
            value={form.name}
            placeholder="예: 성산일출봉"
            onChange={(e) => onChange("name", e.target.value)}
          />

          <FormInput
            label="요약 설명"
            value={form.summary}
            placeholder="예: 붉게 가장 먼저 떠오르는 해"
            onChange={(e) => onChange("summary", e.target.value)}
          />

          <FormSelect
            id="location"
            label="지역"
            value={form.location}
            onChange={(e) => onChange("location", e.target.value)}
            options={[
              { value: "", label: "지역 선택" },
              { value: "서울", label: "서울" },
              { value: "경기도", label: "경기도" },
              { value: "인천", label: "인천" },
              { value: "충청도", label: "충청도" },
              { value: "전라도", label: "전라도" },
              { value: "경상도", label: "경상도" },
              { value: "강원도", label: "강원도" },
              { value: "제주도", label: "제주도" },
            ]}
          />
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="sr-only">이미지 및 공개 여부</legend>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              대표 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageChange(file);
              }}
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="미리보기"
                className="w-full h-64 object-cover rounded-xl mt-4"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-base font-semibold text-gray-800">
              공개 여부
            </label>
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => onChange("visible", e.target.checked)}
            />
            <span className="text-sm text-gray-500">
              체크 시 사용자에게 노출됩니다
            </span>
          </div>
        </fieldset>
      </section>

      {/* 2. 상세 설명 및 위치 설명 */}
      <section className="space-y-3">
        <fieldset>
          <legend className="sr-only">상세 설명</legend>
          <FormTextarea
            id="description"
            label="상세 설명"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={20}
          />
        </fieldset>

        <fieldset>
          <legend className="sr-only">위치 설명</legend>
          <FormInput
            id="locationInfo"
            label="위치 설명"
            type="text"
            value={form.locationInfo}
            onChange={(e) => onChange("locationInfo", e.target.value)}
          />
        </fieldset>
      </section>

      {/* 3. 찾아가는 방법 + 주변 정보 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <fieldset className="space-y-3">
          <legend className="sr-only">찾아가는 방법</legend>
          <FormTextarea
            id="direction"
            label="찾아가는 방법"
            value={form.direction}
            onChange={(e) => onChange("direction", e.target.value)}
            placeholder="예: 제주국제공항에서 30분 소요"
            rows={10}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="sr-only">주변 정보</legend>
          <FormTextarea
            id="nearby"
            label="주변 정보"
            value={form.nearby}
            onChange={(e) => onChange("nearby", e.target.value)}
            rows={10}
          />
        </fieldset>
      </section>

      {/* 4. 제출 버튼 */}
      <div className="pt-10 border-t flex justify-end gap-3">
        {isEdit && (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            수정 취소
          </button>
        )}
        <FormSubmitButton
          isLoading={loading}
          label={isEdit ? "추천 여행지 수정하기" : "추천 여행지 등록하기"}
          variant="dark"
        />
      </div>
    </form>
  );
}

export default React.memo(RecommendationForm);
