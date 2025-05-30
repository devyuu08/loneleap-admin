import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import EmptyState from "@/components/common/EmptyState";
import { MessageSquareOff } from "lucide-react";

export default function ChatReportLineChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow min-h-[280px] flex items-center justify-center">
        <EmptyState
          message="최근 채팅 신고 데이터가 없습니다."
          icon={<MessageSquareOff className="w-6 h-6 text-gray-300 mb-2" />}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow min-h-[280px] flex flex-col">
      <h3 className="text-base font-semibold mb-4">
        💬 최근 7일 채팅 신고 추이
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 0, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} width={30} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#F97316" // orange-500
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
