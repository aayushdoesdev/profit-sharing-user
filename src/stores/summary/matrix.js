import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixSummaryStore = defineStore('matrixSummary', () => {
    
    const endpoint='matrixSummary'
    const wait=0
    const matrixSummary = ref({});

    async function getMatrixSummary() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if (response.data){
                matrixSummary.value = response.data;
            } else {
                matrixSummary.value = {};
            }

        } catch (error) {
            console.error('Error fetching matrixSummary:', error);
            throw error;
        }
    }

    getMatrixSummary();

    return {
        getMatrixSummary,
        matrixSummary,
        state,
        endpoint,
    };
});