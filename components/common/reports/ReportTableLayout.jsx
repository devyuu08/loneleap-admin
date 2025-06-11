import EmptyState from "@/components/common/feedback/EmptyState";
import React from "react";

function ReportTableLayout({ icon, emptyMessage, columns, rows }) {
  const isEmpty = !Array.isArray(rows) || rows.length === 0;

  return (
    <div className="w-full">
      {isEmpty ? (
        <EmptyState icon={icon} message={emptyMessage} className="py-12" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                {columns.map((col, index) => (
                  <th key={index} className="px-4 py-2 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b hover:bg-gray-100 transition cursor-pointer"
                  onClick={row.onClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      row.onClick();
                    }
                  }}
                >
                  {row.cells.map((cell, index) => (
                    <td key={index} className="px-4 py-3 whitespace-nowrap">
                      <div className={cell.className || "truncate"}>
                        {cell.content}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default React.memo(ReportTableLayout);
