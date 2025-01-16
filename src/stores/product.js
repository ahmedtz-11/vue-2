import { defineStore } from 'pinia';
import axios from 'axios';
import dataService from '@/services/dataService';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
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
        alert('Failed to load products.');
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
        alert('Failed to load product details.');
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
          alert(response.data.message);
          await this.fetchProducts();
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product.');
      }
    },
    //delete product by id
    async deleteProduct(id) {
      try {
        const response = await dataService.deleteProduct(id);
        if (response.data.success) {
          alert(response.data.message);
          await this.fetchProducts();
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    },

    // Fetch categories
    async fetchCategories() {
      try {
        const response = await dataService.getSplash();
        return response?.data?.data?.categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories.');
        return [];
      }
    },
  },
});
