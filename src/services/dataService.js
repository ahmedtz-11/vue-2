import http from '/home/ahmed/Documents/vue-projects/vue-2/src/services/httpcommon.js';

//SPLASH ENDPOINT
const getSplash = () => {
  return http.get('/splash/getSplash.php');
}

//USERS ENDPOINTS
const login = (credentials) => {
  return http.post('/users/login.php', credentials);
};

const createUser = (data) => {
    return http.post('/users/addUser.php', data);
  };

const updateUser = (id, data) => {
    return http.put(`/users/updateProduct.php?id=${id}`, data);
  };

  const deleteUser = (id) => {
    return http.delete(`/users/deleteUser.php?id=${id}`);
  };

//PRODUCTS ENDPOINTS
const getProductById = (id) => {
  return http.get(`/products/getSingleProduct.php?id=${id}`);
};

const createProduct = (data) => {
  return http.post('/products/addProduct.php', data);
};

const updateProduct = (id, data) => {
  return http.put(`/products/updateProduct.php?id=${id}`, data);
};

const deleteProduct = (id) => {
  return http.delete(`/products/deleteProduct.php?id=${id}`);
};

//STOCK ENDPOINTS
const updateStock = (id, data) => {
    return http.put(`/stock/updateStock.php?id=${id}`, data);
}

//SALES AND TRANSACTIONS ENDPOINT
const newTransaction = (data) => {
  return http.post('/sales/addTransaction.php', data);
};


export default {
  login,
  createUser,
  getSplash,
  updateUser,
  deleteUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  newTransaction
};
