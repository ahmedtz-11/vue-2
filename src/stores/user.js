import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
  }),
  actions: {
    fetchLoggedInUser() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.username = user?.username || 'Unknown';
    },
  },
});
