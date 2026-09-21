import api from "./axios";
export const categoryAPI = {
  getAll:    () => api.get("/categories"),
  getActive: () => api.get("/categories/active"),
  create:    (data) => api.post("/categories", data),
};