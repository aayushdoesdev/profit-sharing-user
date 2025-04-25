import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useStrategyTypesStore = defineStore('strategyType', () => {
    
    const endpoint='strategyType'
    const wait=0
    const strategyTypes = ref([]);

    // const showDeleteConfirmationModal = ref(null);
    // const idForDelete = ref(null);

    // const showAddEditModal = ref(false);
    // const editUserData = ref({});


    async function getStrategyTypes() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            
            if (response.data){
                strategyTypes.value = response.data;
            } else {
                strategyTypes.value = [];
            }

        } catch (error) {
            console.error('Error fetching strategyType:', error);
            throw error;
        }
    }

    getStrategyTypes();

    return {
        getStrategyTypes,
        strategyTypes,
        state,
        endpoint,
        
        // editStrategyTypes, 
        // showAddEditModal, 
        // editStrategyTypesData, 
        
        // showDeleteConfirmationModal, 
        // idForDelete,
        // deleteStrategyTypes,
    };
});