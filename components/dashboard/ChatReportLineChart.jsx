"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import EmptyState from "@/components/common/feedback/EmptyState";
import { MessageSquareOff } from "lucide-react";
import {
  chartContainerBox,
  chartEmptyBox,
  chartHeading,
} from "@/styles/chartStyles";

/**
 * ChatReportLineChart
 * - 최근 7일간의 채팅 신고 건수를 선 그래프로 시각화
 * - 데이터가 없을 경우 EmptyState 반환
 * - Recharts 사용, 반응형 차트 컨테이너로 구성
 * - 시맨틱 태그 + 접근성 처리(id/aria-labelledby)
 */

const chartMargin = { top: 10, right: 20, bottom: 0, left: 10 };
const dotStyle = { r: 3 };

function ChatReportLineChart({ data }) {
  // 유효한 데이터가 있는지 확인
  const hasData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  // 데이터 없음 → EmptyState
  if (!hasData) {
    return (
      <section className={chartEmptyBox}>
        <EmptyState
          message="최근 채팅 신고 데이터가 없습니다."
          icon={<MessageSquareOff className="w-6 h-6 text-gray-300 mb-2" />}
        />
      </section>
    );
  }

  return (
    <section
      className={chartContainerBox}
      role="region"
      aria-labelledby="chat-report-chart"
    >
      <h3 className={chartHeading} id="chat-report-chart">
        💬 최근 7일 채팅 신고 추이
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} width={30} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#F97316" // orange-500
              strokeWidth={2}
              dot={dotStyle}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default React.memo(ChatReportLineChart);
