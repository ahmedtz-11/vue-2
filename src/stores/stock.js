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

    //create new stock
    async addStock(stockData) {
      try {
        const response = await axios.post(
          "http://localhost:8080/vue-api/stocks/addStock.php",
          stockData
        );

        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = "Stock added successfully!";
          this.alertType = "success";
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error adding stock:", error);
        this.showAlert = true;
        this.alertMessage = "An error occurred while adding stock.";
        this.alertType = "danger";
        return false;
      }
    },
  },
});
