import http from "/home/ahmed/Documents/vue-projects/vue-2/src/services/httpcommon.js";

class DataService {
  //SPLASH ENDPOINT
  getSplash = () => {
    return http.get("/splash/getSplash.php");
  };

  //USERS ENDPOINTS
  login = (credentials) => {
    return http.post("/users/login.php", credentials);
  };

  createUser = (data) => {
    return http.post("/users/addUser.php", data);
  };

  updateUser = (id, data) => {
    return http.put(`/users/updateUser.php?id=${id}`, data);
  };

  deleteUser = (id) => {
    return http.delete(`/users/deleteUser.php`, {
      data: { id },
    });
  };

  changePin = (id, data) => {
    return http.put(`/users/changePin.php?id=${id}`, data);
  };

  //PRODUCTS ENDPOINTS
  getProductById = (id) => {
    return http.get(`/products/getSingleProduct.php?id=${id}`);
  };

  createProduct = (data) => {
    return http.post("/products/addProduct.php", data);
  };

  updateProduct = (id, data) => {
    return http.put(`/products/updateProduct.php?id=${id}`, data);
  };

  deleteProduct = (id) => {
    return http.delete(`/products/deleteProduct.php`, {
      data: { id },
    });
  };

  // CATEGORIES ENDPOINT
  newCategory = (data) => {
    return http.post("/products/addCategory.php", data);
  };

  editCategory = (id, data) => {
    return http.put(`/products/editCategory.php?id=${id}`, data);
  };

  //STOCK ENDPOINTS
  newStock = (data) => {
    return http.post("/stocks/addStock.php", data);
  };

  updateStock = (id, data) => {
    return http.put(`/stocks/editStock.php?id=${id}`, data);
  };

  //SALES AND TRANSACTIONS ENDPOINT
  newTransaction = (data) => {
    return http.post("/sales/addTransaction.php", data);
  };
}

export default new DataService();
