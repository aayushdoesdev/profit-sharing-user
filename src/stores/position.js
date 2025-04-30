import { makeRequest } from "@/requests/requests";
import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useProfileStore } from "./profile";

export const usePositionStore = defineStore("positions", () => {
  const endpoint = "positions";
  const positions = ref([]);
  const positionCount = ref(0);


  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  //   Get positions
  const getPositions = async () => {
    try {
      await profileStore.getProfile()
      const response = await makeRequest(endpoint, "GET", {}, {}, {}, 0, profile.value?.id, 'user');
      if (response.data) {
        positions.value = response.data?.positions;
        positionCount.value = response.data?.count;
      }
    } catch (error) {
      console.log("This is error", error);
    }
  };

  //   Group the positoin according the strategy and users
  
  getPositions();

  return {
    getPositions,
    positions,
    positionCount,
  };
});
