import api from "./axios";
export const notificationAPI = {
  getMy:          (page=0)  => api.get(`/notifications/my?page=${page}&size=20`),
  getUnreadCount: ()        => api.get("/notifications/my/unread-count"),
  markAllRead:    ()        => api.put("/notifications/my/mark-all-read"),
};