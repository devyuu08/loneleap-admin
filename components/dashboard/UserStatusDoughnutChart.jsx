import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/common/feedback/EmptyState";
import {
  chartContainerBox,
  chartEmptyBox,
  chartHeading,
} from "@/styles/chartStyles";

/**
 * UserStatusDonutChart
 * - 사용자 상태(예: 활성, 정지 등) 분포를 도넛 차트로 시각화
 * - 데이터가 없을 경우 EmptyState 컴포넌트로 대체
 */

const COLORS = ["#10B981", "#F59E0B", "#9CA3AF"]; // 초록 / 주황 / 회색

function UserStatusDonutChart({ data }) {
  const hasData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);

  if (!hasData) {
    return (
      <section className={chartEmptyBox}>
        <EmptyState
          message="사용자 상태 데이터가 없습니다."
          icon={<PieChart className="w-6 h-6 text-gray-300 mb-2" />}
        />
      </section>
    );
  }

  return (
    <section
      className={chartContainerBox}
      role="region"
      aria-labelledby="user-status-chart"
    >
      <h3 className={chartHeading} id="user-status-chart">
        🧑‍💼 사용자 활동 분포
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={40}
              paddingAngle={2}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default React.memo(UserStatusDonutChart);
