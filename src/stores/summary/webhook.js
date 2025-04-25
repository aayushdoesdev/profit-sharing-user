import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookSummaryStore = defineStore('webhookSummary', () => {
    
    const endpoint='webhookSummary'
    const wait=0
    const webhookSummary = ref({});

    async function getWebhookSummary() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if (response.data){
                webhookSummary.value = response.data;
            } else {
                webhookSummary.value = {};
            }

        } catch (error) {
            console.error('Error fetching webhookSummary:', error);
            throw error;
        }
    }

    // getWebhookSummary();

    return {
        getWebhookSummary,
        webhookSummary,
        state,
        endpoint,
    };
});