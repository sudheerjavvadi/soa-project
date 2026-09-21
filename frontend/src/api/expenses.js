import api from "./axios";
export const expenseAPI = {
  getMy:    (page=0, size=10) => api.get(`/expenses/my?page=${page}&size=${size}`),
  getAll:   (page=0, size=10) => api.get(`/expenses?page=${page}&size=${size}`),
  getPending: (page=0)        => api.get(`/expenses/pending?page=${page}&size=20`),
  getById:  (id)              => api.get(`/expenses/${id}`),
  create:   (data)            => api.post("/expenses", data),
  submit:   (id)              => api.put(`/expenses/${id}/submit`),
  approve:  (id)              => api.put(`/expenses/${id}/approve`),
  reject:   (id, reason)      => api.put(`/expenses/${id}/reject`, null, { params:{ reason } }),
};