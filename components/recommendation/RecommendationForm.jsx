// admin/components/RecommendationForm.jsx
import { useState } from "react";

export default function RecommendationForm({ onSubmit, loading }) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location || !description || !imageFile)
      return alert("필수 항목을 모두 입력하세요.");

    const formData = {
      name,
      summary,
      location,
      description,
      imageFile,
      visible,
      locationInfo,
      direction,
      nearby,
    };

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900">추천 여행지 등록</h2>

      {/* 장소명 */}
      <div>
        <label className="block font-medium mb-1">장소명</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="예: 성산일출봉"
        />
      </div>

      {/* 요약 설명 */}
      <div>
        <label className="block font-medium mb-1">요약 설명</label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="예: 붉게 가장 먼저 떠오르는 해"
        />
      </div>

      {/* 지역 선택 */}
      <div>
        <label className="block font-medium mb-1">지역</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">지역 선택</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="충청도">충청도</option>
          <option value="전라도">전라도</option>
          <option value="경상도">경상도</option>
          <option value="강원도">강원도</option>
          <option value="제주도">제주도</option>
        </select>
      </div>

      {/* 설명 */}
      <div>
        <label className="block font-medium mb-1">상세 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="이 장소에 대한 자세한 설명을 입력하세요"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block font-medium mb-1">대표 이미지</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="미리보기"
            className="w-full h-60 object-cover rounded-xl mt-4"
          />
        )}
      </div>

      {/* 위치 정보: 3종 */}
      <div>
        <label className="block font-medium mb-1">위치 정보</label>
        <input
          type="text"
          value={locationInfo}
          onChange={(e) => setLocationInfo(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-2"
          placeholder="예: 제주 서귀포시 성산읍 일출로 284-12"
        />
        <textarea
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-2"
          placeholder="찾아가는 방법: 대중교통 또는 자차 안내"
          rows={2}
        />
        <textarea
          value={nearby}
          onChange={(e) => setNearby(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="주변 정보: 근처 카페, 명소, 편의시설 등"
          rows={2}
        />
      </div>

      {/* 공개 여부 */}
      <div className="flex items-center gap-3">
        <label className="font-medium">공개 여부</label>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        <span className="text-sm text-gray-500">
          체크 시 사용자에게 노출됩니다
        </span>
      </div>

      {/* 등록 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        {loading ? "등록 중..." : "추천 여행지 등록하기"}
      </button>
    </form>
  );
}
