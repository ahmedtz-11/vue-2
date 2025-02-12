import { defineStore } from "pinia";
import dataService from "@/services/dataService";

export const useUserStore = defineStore("user", {
  state: () => ({
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    username: "",
    userId: "",
    searchQuery: "",
    users: [],
  }),
  getters: {
    filteredUsers: (state) => {
      if (!Array.isArray(state.users)) return [];
      if (!state.searchQuery) return state.users;
      return state.users.filter((user) =>
        user.username.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    //Get logged-in user details
    fetchLoggedInUser() {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.username = user?.username || "Unknown";
      this.userId = user?.id || null;
    },

    //get all registered users
    async fetchUsers() {
      try {
        const response = await dataService.getSplash();
        this.users = response?.data?.data?.users || [];
        console.log("Users:", this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    async saveUser(userData, isEditing) {
      try {
        const response = isEditing
          ? await dataService.updateUser(userData.id, userData)
          : await dataService.createUser(userData);

        if (response.data.success) {
          await this.fetchUsers();
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error || "Operation failed.";
          this.alertType = "danger";
        }
      } catch (error) {
        console.error("Error saving user:", error);
        this.showAlert = true;
        this.alertMessage = error;
        this.alertType = "danger";
      }
    },

    // Change pin by user ID
    async changePin(userid, data) {
      try {
        const response = await dataService.changePin(userid, data);
        return response.data;
      } catch (error) {
        console.error("Error changing PIN:", error);
        return {
          success: false,
          error: "An error occurred while changing the PIN.",
        };
      }
    },

    //delete user by id
    async deleteUser(id) {
      try {
        const response = await dataService.deleteUser(id);
        if (response.data.success) {
          this.showAlert = true;
          this.alertMessage = response.data.message;
          this.alertType = "success";
          await this.fetchUsers();
        } else {
          this.showAlert = true;
          this.alertMessage = response.data.error;
          this.alertType = "error";
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        this.showAlert = true;
        this.alertMessage = "Failed to delete user";
        this.alertType = "error";
      }
    },
  },
});
