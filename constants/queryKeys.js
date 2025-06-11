export const RECOMMENDATIONS = {
  LIST: ["recommendations"],
  DETAIL: (id) => ["recommendations", id],
  MUTATION: ["recommendations", "mutation"],
};

export const ADMIN_REPORTS = {
  REVIEW: ["adminReports", "review"],
  CHAT: ["adminReports", "chat"],
};
