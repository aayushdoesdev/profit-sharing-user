import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useManualSummaryStore = defineStore('manualSummary', () => {
    
    const endpoint='manualSummary'
    const wait=0
    const manualSummary = ref({});

    async function getManualSummary() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if (response.data){
                manualSummary.value = response.data;
            } else {
                manualSummary.value = {};
            }

        } catch (error) {
            console.error('Error fetching manualSummary:', error);
            throw error;
        }
    }

    // getManualSummary();

    return {
        getManualSummary,
        manualSummary,
        state,
        endpoint,
    };
});