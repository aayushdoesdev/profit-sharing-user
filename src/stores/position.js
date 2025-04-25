import { makeRequest } from "@/requests/requests";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useProfileStore } from "./profile";

export const usePositionStore = defineStore('position' , () => {

    const endpoint = 'positions';
    const positions = ref([]);

    const profileStore = useProfileStore();
    const { profile } = storeToRefs(profileStore);

    const getPositions = async () => {
        try {
            const response = await makeRequest(endpoint , 'GET' , {} , {} , {} , 2 , profile.value.id);
            if(response.data)
            {
                positions.value = response.data.positions;
            }
        } catch (error) {
            console.error("Error fetching positions:", error);
        }

    }

    getPositions();
    return {
        positions,
        getPositions
    }

})