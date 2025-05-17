// 추천 여행지 등록/수정 폼 - 2단+1단 구조 적용
import { useEffect, useState } from "react";

export default function RecommendationForm({
  onSubmit,
  loading,
  initialValues,
}) {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [visible, setVisible] = useState(true);
  const [locationInfo, setLocationInfo] = useState("");
  const [direction, setDirection] = useState("");
  const [nearby, setNearby] = useState("");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setSummary(initialValues.summary || "");
      setLocation(initialValues.location || "");
      setDescription(initialValues.description || "");
      setImagePreview(initialValues.imageUrl || null);
      setVisible(initialValues.visible ?? true);
      setLocationInfo(initialValues.locationInfo || "");
      setDirection((initialValues.directions || []).join("\n"));
      setNearby((initialValues.nearbyInfo || []).join("\n"));
    }
  }, [initialValues]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !description || (!imageFile && !imagePreview)) {
      return alert("필수 항목을 모두 입력하세요.");
    }

    const formData = {
      name,
      summary,
      location,
      description,
      imageFile,
      visible,
      locationInfo,
      directions: direction.split("\n").filter((line) => line.trim()),
      nearbyInfo: nearby.split("\n").filter((line) => line.trim()),
    };

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-screen-lg mx-auto px-10 py-16 space-y-16"
    >
      <h2 className="text-3xl font-bold text-gray-900">
        {initialValues ? "추천 여행지 수정" : "추천 여행지 등록"}
      </h2>

      {/* 1. 기본 정보 + 이미지 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              장소명
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="예: 붉게 가장 먼저 떠오르는 해"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              지역
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
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
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={12}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base leading-relaxed"
        />
      </div>

      {/* 3. 위치 설명 */}
      <div className="space-y-3">
        <label className="text-lg font-semibold">위치 설명</label>
        <input
          type="text"
          value={locationInfo}
          onChange={(e) => setLocationInfo(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
        />
      </div>

      {/* 4. 찾아가는 방법 + 주변 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <label className="text-lg font-semibold">찾아가는 방법</label>
          <textarea
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
          />
        </div>
        <div className="space-y-3">
          <label className="text-lg font-semibold">주변 정보</label>
          <textarea
            value={nearby}
            onChange={(e) => setNearby(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
          />
        </div>
      </div>

      {/* 5. 버튼 */}
      <div className="pt-10 border-t flex justify-end">
        {initialValues && (
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
            : initialValues
            ? "추천 여행지 수정하기"
            : "추천 여행지 등록하기"}
        </button>
      </div>
    </form>
  );
}
