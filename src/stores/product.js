import { defineStore } from "pinia";
import axios from "axios";
import dataService from "@/services/dataService";

export const useProductStore = defineStore("product", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    products: [],
    products2: [],
    categories: [],
    availableProducts: [],
    unavailableProducts: [],
    searchQuery: "",
  }),
  getters: {
    filteredProducts: (state) => {
      if (!Array.isArray(state.products)) return [];
      if (!state.searchQuery) return state.products;
      return state.products.filter((product) =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    filteredProducts2: (state) => {
      if (!Array.isArray(state.products2)) return [];
      if (!state.searchQuery) return state.products2;
      return state.products.filter((product) =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    filteredCategories: (state) => {
      if (!Array.isArray(state.categories)) return [];
      if (!state.searchQuery) return state.categories;
      return state.categories.filter((category) =>
        category.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    //get all products
    async fetchProducts() {
      try {
        const response = await dataService.getSplash();
        this.products = response?.data?.data?.products || [];
        console.log("Products:", this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to load products.";
        this.alertType = "danger";
      }
    },

    //get all products for sell
    async fetchProductsForSell() {
      try {
        const response = await dataService.getSplash();
        this.products2 = response?.data?.data?.products_forSell || [];
        console.log("Products:", this.products2);
      } catch (error) {
        console.error("Error fetching products:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to load products.";
        this.alertType = "danger";
      }
    },

    // Filter products to include only 'Available'
    async fetchAvailableProducts() {
      try {
        const response = await dataService.getSplash();
        const allProducts = response?.data?.data?.products || [];
        this.availableProducts = allProducts.filter(
          (product) => product.product_status === "Available"
        );
        console.log("Available Products:", this.availableProducts);
      } catch (error) {
        console.error("Error fetching available products:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to load available products.";
        this.alertType = "danger";
      }
    },

    // Filter products to include only those with status 'Not Available'
    async fetchUnavailableProducts() {
      try {
        const response = await dataService.getSplash();
        const allProducts = response?.data?.data?.products || [];
        this.unavailableProducts = allProducts.filter(
          (product) => product.product_status === "Not Available"
        );
        console.log("Unavailable Products:", this.unavailableProducts);
      } catch (error) {
        console.error("Error fetching unavailable products:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to load unavailable products.";
        this.alertType = "danger";
      }
    },

    //add new product or edit the existing product
    async saveProduct(productData) {
      const endpoint = productData.id
        ? "http://localhost:8080/vue-api/products/updateProduct.php"
        : "http://localhost:8080/vue-api/products/addProduct.php";

      try {
        const response = await axios.post(endpoint, productData);
        if (response.data.message) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
          await this.fetchProducts();
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error("Error saving product:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to save product.";
        this.alertType = "error";
      }
    },

    //delete product by id
    async deleteProduct(id) {
      try {
        const response = await dataService.deleteProduct(id);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
          await this.fetchProducts();
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error;
          this.alertType = "error";
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to delete product";
        this.alertType = "error";
      }
    },

    // Fetch categories
    async fetchCategories() {
      try {
        const response = await dataService.getSplash();
        this.categories = response?.data?.data?.categories || [];
        return this.categories; 
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.alertMessage = "Failed to load categories.";
        this.alertType = "error";
        this.showAlert = true;
        return [];
      }
    },

    // Create new category & Updating
    async saveCategory(catData, isEditing) {
          try {
            const response = isEditing
              ? await dataService.editCategory(catData.id, catData)
              : await dataService.newCategory(catData);
    
            if (response.data.success) {
              await this.fetchCategories();
              this.showAlert = true;
              this.alertMessage = response.data.message;
              this.alertType = "success";
            } else {
              this.showAlert = true;
              this.alertMessage = response.data.error || "Operation failed.";
              this.alertType = "danger";
            }
          } catch (error) {
            console.error("Error saving category:", error);
            this.showAlert = true;
            this.alertMessage = error;
            this.alertType = "danger";
          }
        },
  },
});
