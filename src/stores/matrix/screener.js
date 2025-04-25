import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useScreenersStore = defineStore('screeners', () => {
    
    const endpoint='screeners'
    const wait=0
    const screeners = ref([]);
    let showEditScreenersModal = ref(false);
    const editScreenerData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const showCopyScreenerId = ref(0);

    async function getScreeners() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if (response.data){
                screeners.value = response.data;
            } else {
                screeners.value = [];
            }

        } catch (error) {    
            console.error('Error fetching screeners:', error);
            // throw error;
        }
    }

    // addEditScreener function edit screeners
    async function addEditScreener(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching screeners:', error);
            throw error;
        }
    }

    // deleteScreeners function delete screener from db
    async function deleteScreeners(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting screener:', error);
            throw error;
        }
    }

    getScreeners()

    return {
        getScreeners,
        screeners,
        showEditScreenersModal,
        addEditScreener,
        editScreenerData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deleteScreeners,    
        showCopyScreenerId    
    };
});
