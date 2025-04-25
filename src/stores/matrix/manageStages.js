import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useManageStagesStore = defineStore('manageStages', () => {
    
    const endpoint='manageStages'
    const wait=0
    const manageStages = ref([]);
    const manageStagesById = ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showOrderStageModal = ref(false);
    const editManageStageData = ref({});

    const page_id = 1
    const page_size = 100

    async function getManageStages() {
        // try {
        //     const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
        //     if (response.data){
        //         manageStages.value = response.data.sort((a, b) => a.id - b.id);
        //     } else {
        //         manageStages.value = [];
        // }

        // } catch (error) {
        //     console.error('Error fetching manageStages:', error);
        //     throw error;
        // }
    }

    // by id 
    async function getManageStagesById(id) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id);
            if (response.data){
                manageStagesById.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching manageStages:', error);
            throw error;
        }
    }

    // editManageStage function edit manageStages
    async function editManageStage(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching manageStage:', error);
            throw error;
        }
    }


    getManageStages();

    return {
        getManageStages,
        getManageStagesById,
        manageStages,
        manageStagesById,
        state,
        endpoint,
        
        editManageStage, 
        showOrderStageModal, 
        editManageStageData, 
        
        showDeleteConfirmationModal, 
        idForDelete,

    };
});