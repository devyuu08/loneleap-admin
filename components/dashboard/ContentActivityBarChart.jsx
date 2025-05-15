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

  // MM월 형식으로 변환한 데이터
  const formattedData = data.map((item) => ({
    ...item,
    month: item.month.slice(5) + "월", // "2025-05" -> "05월"
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow min-h-[280px] flex flex-col">
      <h3 className="text-base font-semibold mb-4">
        🗓️ 최근 6개월 사용자 작성 활동
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} interval={0} />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar
              dataKey="reviews"
              fill="#3B82F6"
              name="리뷰 작성 수"
              barSize={20}
            />
            <Bar
              dataKey="itineraries"
              fill="#F97316"
              name="일정 작성 수"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
