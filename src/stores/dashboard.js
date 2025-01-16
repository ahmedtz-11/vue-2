import { defineStore } from 'pinia';
import dataService from '@/services/dataService';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    totals: {
      totalProducts: 0,
      totalStock: 0,
      totalSales: 0,
      totalUsers: 0,
    },
    transactions: [],
    products: [],
    stocks: [],
    categories: [],
    users: [],
  }),
  actions: {
    async initializeDashboard() {
      try {
        const response = await dataService.getSplash();
    
        // Check if the response structure is as expected
        if (response.status === 200 && response.data.code === 200) {
          const data = response.data.data;
    
          // Extract totals
          this.totals.totalProducts = Array.isArray(data.products) ? data.products.length : 0;
          this.totals.totalStock = Array.isArray(data.stocks)
            ? data.stocks.reduce((sum, stock) => sum + (stock.quantity || 0), 0)
            : 0;
          this.totals.totalUsers = Array.isArray(data.users) ? data.users.length : 0;

          // Handle transactions properly
          const transactionsArray = Object.keys(data.transactions).map(key => data.transactions[key]);
          this.totals.totalSales = transactionsArray.reduce((sum, transaction) => sum + parseFloat(transaction.total_amount || 0), 0);
    
          // Set other data
          this.transactions = transactionsArray;
          this.products = data.products || [];
          this.stocks = data.stocks || [];
          this.categories = data.categories || [];
          this.users = data.users || [];
        } else {
          console.error('Failed to fetch dashboard data:', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },    
  },
});
