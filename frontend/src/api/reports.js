import api from "./axios";

export const reportAPI = {
  getDashboard: () => api.get("/api/reports/dashboard"),
  getMonthly: () => api.get("/api/reports/monthly"),
  getCategory: () => api.get("/api/reports/category"),
  getDepartment: () => api.get("/api/reports/department"),
  getBudget: () => api.get("/api/reports/budget"),
  getReconciliation: () => api.get("/api/reports/reconciliation"),
  getTrends: () => api.get("/api/reports/trends"),
};
