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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 handleSubmit 실행됨");
    if (!name || !location || !description || !imageFile) {
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
      directions: direction
        ? direction.split("\n").filter((line) => line.trim() !== "")
        : [],
      nearbyInfo: nearby
        ? nearby.split("\n").filter((line) => line.trim() !== "")
        : [],
    };

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow space-y-10"
    >
      <h2 className="text-2xl font-semibold text-gray-900">추천 여행지 등록</h2>

      {/* 기본 정보 */}
      <section className="space-y-4">
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
      </section>

      {/* 상세 설명 */}
      <section>
        <label className="block font-medium mb-2">상세 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder={`예: 성산일출봉은 제주도 동쪽 끝에 위치한 화산 지형으로,
> "세상에서 가장 먼저 해가 뜨는 곳"으로 불립니다.
계절마다 다른 풍경을 보여주며, 정상에서 일출을 보는 경험은 잊지 못할 추억이 됩니다.`}
        />
        <p className="text-sm text-gray-500 mt-1">
          <code>&gt; 인용구</code> 형태로 입력하면 인용 블록으로 렌더링됩니다.
        </p>
      </section>

      {/* 이미지 업로드 */}
      <section>
        <label className="block font-medium mb-2">대표 이미지</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="미리보기"
            className="w-full h-60 object-cover rounded-xl mt-4"
          />
        )}
      </section>

      {/* 위치 정보 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">위치 정보</h3>

        <div>
          <label className="block font-medium mb-1">위치 설명</label>
          <input
            type="text"
            value={locationInfo}
            onChange={(e) => setLocationInfo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="예: 제주 서귀포시 성산읍 일출로 284-12"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">찾아가는 방법</label>
          <textarea
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder={`예: 제주시 터미널에서 701번 버스를 타고 약 1시간 소요
자가용 이용 시 약 50분 소요되며, 근처에 주차장 있음.`}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">주변 정보</label>
          <textarea
            value={nearby}
            onChange={(e) => setNearby(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder={`예: 주변에 유명한 카페 "일출커피", 성산항, 올레길 1코스가 인접해 있음.`}
          />
        </div>
      </section>

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
