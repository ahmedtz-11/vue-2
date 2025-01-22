import { defineStore } from 'pinia';
import axios from 'axios';
import dataService from '@/services/dataService';

export const useProductStore = defineStore('product', {
  state: () => ({
    alertMessage: '',
    alertType: 'info', 
    showAlert: false, 
    products: [],
    availableProducts: [],
    unavailableProducts: [],
    searchQuery: '',
    currentProduct: {
      name: '',
      category: '',
      price: '',
      description: '',
      status: '',
    }, // Ensure currentProduct is always an object
  }),
  getters: {
    filteredProducts: (state) => {
      if (!Array.isArray(state.products)) return []; 
      if (!state.searchQuery) return state.products;
      return state.products.filter((product) =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    //get all products
    async fetchProducts() {
      try {
        const response = await dataService.getSplash();
        this.products = response?.data?.data?.products || [];
        console.log('Products:', this.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        this.showAlert = true;
        this.alertMessage = 'Failed to load products.';
        this.alertType = 'danger';
      }
    },


    async fetchAvailableProducts() {
      try {
        const response = await dataService.getSplash();
        const allProducts = response?.data?.data?.products || [];
        // Filter products to include only those with status 'Available'
        this.availableProducts = allProducts.filter(product => product.status === "Available");
        console.log('Available Products:', this.availableProducts);
      } catch (error) {
        console.error('Error fetching available products:', error);
        this.showAlert = true;
        this.alertMessage = 'Failed to load available products.';
        this.alertType = 'danger';
      }
    },

    async fetchUnavailableProducts() {
      try {
        const response = await dataService.getSplash();
        const allProducts = response?.data?.data?.products || [];
        // Filter products to include only those with status 'Not Available'
        this.unavailableProducts = allProducts.filter(product => product.status === "Not Available");
        console.log('Available Products:', this.unavailableProducts);
      } catch (error) {
        console.error('Error fetching unavailable products:', error);
        this.showAlert = true;
        this.alertMessage = 'Failed to load unavailable products.';
        this.alertType = 'danger';
      }
    },
    


    //get a single product by id
    async fetchProductById(id) {
      try {
        const response = await dataService.getProductById(id);
        this.currentProduct = response.data || {
          name: '',
          category: '',
          price: '',
          description: '',
          status: '',
        };
      } catch (error) {
        console.error('Error fetching product:', error);
        this.showAlert = true;
        this.alertMessage = 'Failed to load product details.';
        this.alertType = 'danger';
      }
    },
    //add new product or edit the existing product
    async saveProduct(productData) {
      const endpoint = productData.id
        ? 'http://localhost:8080/vue-api/products/updateProduct.php'
        : 'http://localhost:8080/vue-api/products/addProduct.php';

      try {
        const response = await axios.post(endpoint, productData);
        if (response.data.message) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = 'success';
          await this.fetchProducts();
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error('Error saving product:', error);
        this.showAlert = true;
        this.alertMessage = 'Failed to save product.';
        this.alertType = 'error';
      }
    },
    //delete product by id
    async deleteProduct(id) {
      try {
        const response = await dataService.deleteProduct(id);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;;
          this.alertType = 'success';
          await this.fetchProducts();
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error;;
          this.alertType = 'error';
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
        this.showAlert = true;
        this.alertMessage = 'Failed to delete product';
        this.alertType = 'error';
      }
    },

    // Fetch categories
    async fetchCategories() {
      try {
        const response = await dataService.getSplash();
        return response?.data?.data?.categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        alertMessage.value = 'Failed to load categories.';
        alertType.value = 'error';
        showAlert.value = true;
        return [];
      }
    },

    // Create new categories
    async newCategory(category) {
          try {
            await dataService.newCategory(category);
            await this.getSplash();
          } catch (error) {
            console.error('Error creating category:', error);
          }
        }
  },
});
