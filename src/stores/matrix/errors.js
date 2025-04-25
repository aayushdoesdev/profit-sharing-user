import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";

export const useErrorsStore = defineStore('errors', () => {
    
    
    const endpoint='errors';
    const wait=900
    const errors = ref([]);
    
    const page_id=1
    const page_size=100


    async function getErrors() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                errors.value = response.data;
            } else {
                errors.value = [];
            }
            

        } catch (error) {
            console.error('Error fetching errors:', error);
            throw error;
        }
    }
    getErrors();

    return {
        getErrors,
        endpoint,
        state,
        wait,
        errors
    };
});
