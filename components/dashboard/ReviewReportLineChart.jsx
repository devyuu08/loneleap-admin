"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/common/EmptyState";
import {
  chartContainerBox,
  chartEmptyBox,
  chartHeading,
} from "@/styles/chartStyles";

const chartMargin = { top: 10, right: 20, bottom: 0, left: 10 };
const dotStyle = { r: 3 };

function ReviewReportLineChart({ data }) {
  const hasData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  if (!hasData) {
    return (
      <div className={chartEmptyBox}>
        <EmptyState
          message="최근 리뷰 신고 데이터가 없습니다."
          icon={<LineChart className="w-6 h-6 text-gray-300 mb-2" />}
        />
      </div>
    );
  }

  return (
    <div
      className={chartContainerBox}
      role="region"
      aria-labelledby="review-report-chart"
    >
      <h3 className={chartHeading} id="review-report-chart">
        📈 최근 7일 리뷰 신고 추이
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis width={30} allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={dotStyle}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(ReviewReportLineChart);
