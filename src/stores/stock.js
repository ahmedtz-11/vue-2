import { defineStore } from 'pinia';
import axios from 'axios';
import dataService from '@/services/dataService'; // Import the service

export const useStockStore = defineStore('stockStore', {
  state: () => ({
    stocks: [],
    searchQuery: '',
  }),
  getters: {
    filteredStocks: (state) => {
      if (!state.searchQuery) return state.stocks;
      return state.stocks.filter((stock) =>
        stock.product_name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    async fetchStocks() {
      try {
        const response = await dataService.getSplash();
        this.stocks = response?.data?.data?.stocks || [];
        console.log('Stocks:', this.stocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        alert('Failed to load stocks.');
      }
    },

    async deleteStock(id) {
      try {
        const response = await axios.delete('http://localhost:8080/vue-api/stocks/deleteStock.php', {
          data: { id },
        });
        if (response.data.success) {
          this.stocks = this.stocks.filter((stock) => stock.id !== id);
        } else {
          alert(response.data.error || 'Failed to delete stock');
        }
      } catch (error) {
        console.error('Error deleting stock:', error);
      }
    },

    async addStock(stockData) {
      try {
        const response = await axios.post('http://localhost:8080/vue-api/stocks/addStock.php', stockData);

        if (response.data.success) {
          alert('Stock added successfully!');
          return true;
        } else {
          alert(response.data.error || 'Failed to add stock');
          return false;
        }
      } catch (error) {
        console.error('Error adding stock:', error);
        alert('An error occurred while adding stock.');
        return false;
      }
    },
  },
});
