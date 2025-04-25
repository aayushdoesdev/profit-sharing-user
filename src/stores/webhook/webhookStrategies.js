import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import { useTickerStore } from '../matrix/ticker/ticker'



export const useWebhookStrategyStore = defineStore('webhookStrategies', () => {
    const tickerStore = useTickerStore();
    const endpoint='webhookStrategies'
    const wait=0
    const webhookStrategies = ref([]);
    const webhookStrategiesById = ref([]);
    let requested = ref([]);
    let showAddEditModal = ref(false);
    const editWebhookStrategyData= ref({})
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    const storeStrategyId = ref(0);
    const storeUserId = ref(0);
    const ignoreId = ref([]);

    const showJoinersModal = ref(false);

    const showPositionsModal = ref(false);
    const showPaperPositionModal = ref(false);
    const showStgPaperPositionModal = ref(false);
    const showWebhookPositionModal = ref(false);
    // const showDemoPositionModal = ref(false);
    const paperPositionStrategyId = ref(0);

    
    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const editExpiryModal = ref(false);

    async function getWebhookStrategies() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                webhookStrategies.value = response.data?.strategies || [];

                totalRecords.value = response.data.count || webhookStrategies.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookStrategies.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }

                let tokensList = [], tempData = webhookStrategies.value
                for (let i = 0; i < webhookStrategies.value.length; i++) {
                    tokensList.push(webhookStrategies.value[i].instrument_token)

                    tempData[i].pnl =  ((webhookStrategies.value[i].exit_price - webhookStrategies.value[i].entry_price) * webhookStrategies.value[i].qty) || 0

                }
                tickerStore.updateTickerList(tokensList)

                webhookStrategies.value = tempData

            } else {
                webhookStrategies.value = [];
            }

        } catch (error) {
            console.error('Error fetching webhookStrategies:', error);
            throw error;
        }
    }


    async function getWebhookStrategiesById(id) {
        if(!requested.value.includes(id) && ignoreId.value.includes(id)) {
            requested.value.push(id);  
            // debugger      
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const isExists = webhookStrategies.value.some(wbStg => wbStg.id === response.data.id);
    
                    if (!isExists) {
                        webhookStrategies.value.push(response.data);
                    } else if(response.data == null) {
                        ignoreId.value.push(id);
                    }
                }
            } catch (error) {
                ignoreId.value.push(id);
                throw error;
            } finally {
                requested.value.pop(); // Cleanup logic
            }
        } else {
            if(!requested.value.includes(id)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
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
        showMoreInfoId,
        storeStrategyId,
        storeUserId,
        showJoinersModal,

        showPositionsModal,
        showPaperPositionModal,
        showStgPaperPositionModal,
        showWebhookPositionModal,
        // showDemoPositionModal,
        paperPositionStrategyId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
        editExpiryModal
    };
});