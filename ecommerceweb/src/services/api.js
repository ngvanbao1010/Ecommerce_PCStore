import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api';
const api = axios.create({
  baseURL: BASE_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Token ${token}`;
    }
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (!isFormData && config.data && typeof config.data === 'object') {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    } else if (isFormData) {
      if (config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (userData) => {

    if (userData instanceof FormData) {
      return api.put('/auth/profile/update/', userData);
    }
    return api.put('/auth/profile/update/', userData);
  },
};

export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (categoryData) => api.post('/categories/', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}/`, categoryData),
  delete: (id) => api.delete(`/categories/${id}/`),
};

export const productsAPI = {
  getAll: (params = {}) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (productData) => api.post('/products/create/', productData),
  update: (id, productData) => api.put(`/products/${id}/manage/`, productData),
  delete: (id) => api.delete(`/products/${id}/manage/`),
  compare: (productIds) => api.post('/products/compare/', { product_ids: productIds }),
};

export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (productId, quantity = 1) => api.post('/cart/add/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/${itemId}/update/`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}/remove/`),
};

export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders/', { params }),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (orderData) => api.post('/orders/create/', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/update-status/`, { status }),
  cancel: (id) => api.post(`/orders/${id}/cancel/`),
  updatePaymentStatus: (id, payment_status) => api.put(`/orders/${id}/update-payment/`, { payment_status }),
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/?product_id=${productId}`),
  create: (reviewData) => api.post('/reviews/', reviewData),
};

export const commentsAPI = {
  getByProduct: (productId) => api.get(`/comments/?product_id=${productId}`),
  create: (commentData) => api.post('/comments/', commentData),
};

export const pcConfigAPI = {
  getAll: () => api.get('/pc-configs/'),
  getById: (id) => api.get(`/pc-configs/${id}/`),
  create: (configData) => api.post('/pc-configs/', configData),
  update: (id, configData) => api.put(`/pc-configs/${id}/`, configData),
  delete: (id) => api.delete(`/pc-configs/${id}/`),
};

export const statisticsAPI = {
  getSales: (period = 'daily') => api.get(`/statistics/sales/?period=${period}`),
};

export default api;
