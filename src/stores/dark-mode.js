import { defineStore } from "pinia";

export const useDarkModeStore = defineStore("darkMode", {
  state: () => ({
    darkModeValue: true // localStorage.getItem("darkMode") === "true",
  }),
  getters: {
    darkMode(state) {
      if (localStorage.getItem("darkMode") === null) {
        localStorage.setItem("darkMode", true);
      }
      let metaTag = document.querySelector('meta[name="color-scheme"]');
      const newScheme = state.darkModeValue ? 'dark' : 'light';
      metaTag.setAttribute('content', newScheme);

      return state.darkModeValue;
    },
  },
  actions: {
    setDarkMode(darkMode) {
      localStorage.setItem("darkMode", darkMode);
      this.darkModeValue = darkMode;
    },
  },
});
