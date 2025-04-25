import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookStrategyStore = defineStore('webhookStrategies', () => {
    
    const endpoint='webhookStrategies'
    const wait=0
    const webhookStrategies = ref([]);
    const webhookStrategiesById = ref([]);
    let requested = ref([]);
    let showAddEditModal = ref(false);
    const editWebhookStrategyData= ref({})
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const storeStrategyId = ref(0);
    const storeUserId = ref(0);

    const showJoinersModal = ref(false);

    
    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getWebhookStrategies() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100 //selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if (response.data){
                if(response.data.webhook_strategies){
                    webhookStrategies.value = response.data.webhook_strategies;
                } else {
                    webhookStrategies.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookStrategies.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                webhookStrategies.value = [];
            }

        } catch (error) {
            console.error('Error fetching webhookStrategies:', error);
            throw error;
        }
    }


    async function getWebhookStrategiesById(id) {
        if(!requested.value.includes(id)) {
            requested.value.push(id);        
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const isExists = webhookStrategies.value.some(wbStg => wbStg.id === response.data.id);
    
                    if (!isExists) {
                        webhookStrategies.value.push(response.data);
                    }
                }
            } catch (error) {
                throw error;
            } finally {
                requested.value.pop(); // Cleanup logic
            }
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }


    // deleteWebhookStrategy function delete WebhookStrategy from db
    async function deleteWebhookStrategy(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting WebhookStrategy:', error);
            throw error;
        }
    }


    // addEditWebhookStrategy function edit WebhookStrategy
    async function addEditWebhookStrategy(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching webhookStrategies:', error);
            throw error;
        }
    }

    getWebhookStrategies();

    return {
        getWebhookStrategies,
        getWebhookStrategiesById,
        webhookStrategies,
        webhookStrategiesById,
        deleteWebhookStrategy,
        showAddEditModal,
        addEditWebhookStrategy,
        editWebhookStrategyData,
        endpoint,
        state,
        showDeleteConfirmationModal, 
        idForDelete,
        storeStrategyId,
        storeUserId,
        showJoinersModal,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});