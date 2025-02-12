import { defineStore } from "pinia";
import axios from "axios";
import dataService from "@/services/dataService"; // Import the service

export const useStockStore = defineStore("stockStore", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    stocks: [],
    searchQuery: "",
  }),
  getters: {
    filteredStocks: (state) => {
      if (!state.searchQuery) return state.stocks;
      return state.stocks.filter((stock) =>
        stock.product_name
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    //get all stocks
    async fetchStocks() {
      try {
        const response = await dataService.getSplash();
        this.stocks = response?.data?.data?.stocks || [];
        console.log("Stocks:", this.stocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to load stocks.";
        this.alertType = "danger";
      }
    },

    //remove stock by id
    async deleteStock(id) {
      try {
        const response = await axios.delete(
          "http://localhost:8080/vue-api/stocks/deleteStock.php",
          {
            data: { id },
          }
        );
        if (response.data.success) {
          this.stocks = this.stocks.filter((stock) => stock.id !== id);
        } else {
          alert(response.data.error || "Failed to delete stock");
          this.showAlert = true;
          this.alertMessage = response.data.error;
          this.alertType = "danger";
        }
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    },

    async addStock(stockData, isEditing) {
          try {
            const response = isEditing
              ? await dataService.updateStock(stockData.id, stockData)
              : await dataService.newStock(stockData);
    
            if (response.data.success) {
              await this.fetchStocks();
              this.showAlert = true;
              this.alertMessage = response.data.message;
              this.alertType = "success";
            } else {
              this.showAlert = true;
              this.alertMessage = response.data.error || "Operation failed.";
              this.alertType = "danger";
            }
          } catch (error) {
            console.error("Error saving stock:", error);
            this.showAlert = true;
            this.alertMessage = error;
            this.alertType = "danger";
          }
        },
  },
});
