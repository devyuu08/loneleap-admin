import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ContentActivityBarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
        작성 활동 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow min-h-[280px]">
      <h3 className="text-base font-semibold mb-4">
        🗓️ 최근 6개월 사용자 작성 활동
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="reviews" fill="#3B82F6" name="리뷰 작성 수" />
          <Bar dataKey="itineraries" fill="#F97316" name="일정 작성 수" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
