import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookErrorsStore = defineStore('webhook_errors', () => {
    
    const endpoint='webhookErrors'
    const wait=0
    const webhookErrors = ref([]);
    const webhookErrorsByUser = ref([]);
    let showEditWebhookModal = ref(false);
    const editWebhookErrorData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);

    const page_id=1
    const page_size=100


    async function getWebhookErrors() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                webhookErrors.value = response.data;
            } else {
                webhookErrors.value = [];
            }

        } catch (error) {
            console.error('Error fetching webhook errors:', error);
            throw error;
        }
    }

    async function getWebhookErrorsByUser(id) {
        try {
            const subEndpoint = 'user'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                webhookErrorsByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching errors:', error);
            throw error;
        }
    }

    // addEditWebhookError function edit webhook_errors
    async function addEditWebhookError(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching webhook_errors:', error);
            throw error;
        }
    }

    // getWebhookErrors();

    return {
        getWebhookErrors,
        getWebhookErrorsByUser,
        webhookErrors,
        webhookErrorsByUser,
        showEditWebhookModal,
        addEditWebhookError,
        editWebhookErrorData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
    };
});
