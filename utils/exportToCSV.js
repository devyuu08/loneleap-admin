/**
 * 주어진 데이터 배열을 CSV 파일로 내보냅니다.
 *
 * @param {string} filename - 저장할 CSV 파일 이름 (확장자는 자동으로 `.csv` 붙음)
 * @param {Array<Object>} rows - CSV로 변환할 데이터 배열 (각 객체는 동일한 키 구조여야 함)
 */

export function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","), // 헤더
    ...rows.map((row) =>
      headers
        .map((fieldName) => {
          const escaped = `${row[fieldName] ?? ""}`.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
