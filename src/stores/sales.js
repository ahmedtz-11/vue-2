import { defineStore } from 'pinia';
import dataService from '@/services/dataService';

export const useSalesStore = defineStore('sales', {
  state: () => ({
    alertMessage: '',
    alertType: 'info', 
    showAlert: false, 
    transactions: []
  }),

  actions: {
    async fetchTransactions() {
      try {
        const response = await dataService.getSplash();
        this.transactions = response?.data?.data?.transactions || [];
        console.log('Transactions list:', this.transactions);
      } catch (error) {
        this.showAlert = true;
        this.alertMessage = 'Failed to load transactions.';
        this.alertType = 'danger';
        console.error('Error fetching transactions:', error);
      }
    },

    async createTransaction(transaction) {
      try {
        await dataService.newTransaction(transaction);
        await dataService.getSplash();
      } catch (error) {
        console.error('Error creating transaction:', error);
      }
    }
  }
});
