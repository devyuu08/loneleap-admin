import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormSelect from "@/components/common/FormSelect";
import FormSubmitButton from "@/components/common/FormSubmitButton";

export default function RecommendationForm({
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
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
        </div>

        <div className="space-y-6">
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
        </div>
      </div>

      {/* 2. 상세 설명 */}
      <div className="space-y-3">
        <FormTextarea
          id="description"
          label="상세 설명"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={20}
        />

        {/* 3. 위치 설명 */}

        <FormInput
          id="locationInfo"
          label="위치 설명"
          type="text"
          value={form.locationInfo}
          onChange={(e) => onChange("locationInfo", e.target.value)}
        />
      </div>

      {/* 4. 찾아가는 방법 + 주변 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <FormTextarea
            id="direction"
            label="찾아가는 방법"
            value={form.direction}
            onChange={(e) => onChange("direction", e.target.value)}
            placeholder="예: 제주국제공항에서 30분 소요"
            rows={10}
          />
        </div>
        <div className="space-y-3">
          <FormTextarea
            id="nearby"
            label="주변 정보"
            value={form.nearby}
            onChange={(e) => onChange("nearby", e.target.value)}
            rows={10}
          />
        </div>
      </div>

      {/* 5. 버튼 */}
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
