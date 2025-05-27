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
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              장소명
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="예: 성산일출봉"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              요약 설명
            </label>
            <input
              type="text"
              value={form.summary}
              onChange={(e) => onChange("summary", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="예: 붉게 가장 먼저 떠오르는 해"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              지역
            </label>
            <select
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">지역 선택</option>
              <option value="서울">서울</option>
              <option value="경기도">경기도</option>
              <option value="인천">인천</option>
              <option value="충청도">충청도</option>
              <option value="전라도">전라도</option>
              <option value="경상도">경상도</option>
              <option value="강원도">강원도</option>
              <option value="제주도">제주도</option>
            </select>
          </div>
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
        <label className="text-lg font-semibold">상세 설명</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={12}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base leading-relaxed"
        />
      </div>

      {/* 3. 위치 설명 */}
      <div className="space-y-3">
        <label className="text-lg font-semibold">위치 설명</label>
        <input
          type="text"
          value={form.locationInfo}
          onChange={(e) => onChange("locationInfo", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
        />
      </div>

      {/* 4. 찾아가는 방법 + 주변 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <label className="text-lg font-semibold">찾아가는 방법</label>
          <textarea
            value={form.direction}
            onChange={(e) => onChange("direction", e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
          />
        </div>
        <div className="space-y-3">
          <label className="text-lg font-semibold">주변 정보</label>
          <textarea
            value={form.nearby}
            onChange={(e) => onChange("nearby", e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
          />
        </div>
      </div>

      {/* 5. 버튼 */}
      <div className="pt-10 border-t flex justify-end">
        {isEdit && (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            수정 취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="ml-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {loading
            ? "처리 중..."
            : isEdit
            ? "추천 여행지 수정하기"
            : "추천 여행지 등록하기"}
        </button>
      </div>
    </form>
  );
}
