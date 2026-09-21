import api from "./axios";
export const authAPI = {
  login:        (data)    => api.post("/auth/login", data),
  register:     (data)    => api.post("/auth/register", data),
  getAllUsers:  ()         => api.get("/auth/users"),
  getAuditLogs: ()        => api.get("/auth/audit-logs"),
};