export function formatDateKR(input) {
  if (!input) return "N/A";
  const date =
    typeof input === "string" ? new Date(input) : input.toDate?.() ?? null;

  return date
    ? date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
}
