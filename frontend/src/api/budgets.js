import api from "./axios";
export const budgetAPI = {
  getAll:           ()     => api.get("/budgets"),
  getSummary:       ()     => api.get("/budgets/summary"),
  getAlerts:        ()     => api.get("/budgets/alerts"),
  getReconciliation:()     => api.get("/budgets/reconciliation"),
  create:           (data) => api.post("/budgets", data),
};