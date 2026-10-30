import api from "./axios";
export const authAPI = {
  login:        (data)              => api.post("/auth/login", data),
  register:     (data)              => api.post("/auth/register", data),
  getAllUsers:   ()                  => api.get("/auth/users"),
  getUserById:  (id)                => api.get(`/auth/profile/${id}`),
  updateUser:   (id, data)          => api.put(`/auth/users/${id}`, data),
  deleteUser:   (id)                => api.put(`/auth/users/${id}`, { active: false }),
  getAuditLogs: (page = 0, size = 20) => api.get(`/auth/audit-logs?page=${page}&size=${size}`),
};