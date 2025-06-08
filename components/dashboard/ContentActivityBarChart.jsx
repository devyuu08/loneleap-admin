"use client";

import React, { useMemo } from "react";
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
import EmptyState from "@/components/common/feedback/EmptyState";
import { BarChart3 } from "lucide-react";
import {
  chartContainerBox,
  chartEmptyBox,
  chartHeading,
} from "@/styles/chartStyles";

/**
 * ContentActivityBarChart
 * - 최근 6개월간 사용자 작성 활동(리뷰/일정 수)을 시각화
 * - BarChart 구성, 월 기준으로 포맷된 데이터 사용
 * - 데이터가 없을 경우 EmptyState 렌더링
 */

const chartMargin = { top: 10, right: 20, bottom: 0, left: 0 };

function ContentActivityBarChart({ data }) {
  // 데이터 유효성 확인
  const hasData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  // 월 포맷 정리 ("2025-05" → "05월")
  const formattedData = useMemo(
    () =>
      data?.map((item) => ({
        ...item,
        month: item.month.slice(5) + "월", // "2025-05" → "05월"
      })) || [],
    [data]
  );

  // 데이터 없을 경우
  if (!hasData) {
    return (
      <section className={chartEmptyBox}>
        <EmptyState
          message="최근 작성 활동 데이터가 없습니다."
          icon={<BarChart3 className="w-6 h-6 text-gray-300 mb-2" />}
        />
      </section>
    );
  }

  return (
    <section
      className={chartContainerBox}
      role="region"
      aria-labelledby="activity-bar-chart"
    >
      <h3 className={chartHeading} id="activity-bar-chart">
        🗓️ 최근 6개월 사용자 작성 활동
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={formattedData} margin={chartMargin}>
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
    </section>
  );
}

export default React.memo(ContentActivityBarChart);
