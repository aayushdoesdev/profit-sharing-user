import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookPositionsStore = defineStore('webhook_positions', () => {
    
    const endpoint='webhookPositions'
    const wait=0
    const webhookPositions = ref([]);
    const webhookPositionsByStrategy = ref([]);
    let showEditPositionsModal = ref(false);
    const showWebhookPositionsModal = ref(false);
    const editPositionData = ref({});
    const positionsWebhookStrategyId = ref(0);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    const showDeleteConfirmationModal = ref(null);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const paginationStgPosition = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })


    async function getWebhookPositions() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            
            if(response.data){
                if(response.data.positions){
                    webhookPositions.value = response.data.positions;
                } else {
                    webhookPositions.value = [];
                }

                totalRecords.value = response.data.count;

                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookPositions.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                webhookPositions.value = [];
            }
        } catch (error) {
            console.error('Error fetching matrix positions:', error);
            throw error;
        }
    }

    async function getWebhookPositionsByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgPosition.value.currentPageNumber
                params.page_size = paginationStgPosition.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params,wait, id, subEndpoint);
            if (response.data){
                webhookPositionsByStrategy.value = response.data?.positions || [];

                paginationStgPosition.value.totalRecords = response.data.count || webhookPositionsByStrategy.value.length
                paginationStgPosition.value.showStartRecords = 1 + (paginationStgPosition.value.currentPageNumber-1) * paginationStgPosition.value.page_size
                paginationStgPosition.value.showEndRecords = webhookPositionsByStrategy.value.length + (paginationStgPosition.value.currentPageNumber-1) * paginationStgPosition.value.page_size
                if((paginationStgPosition.value.totalRecords % paginationStgPosition.value.page_size) == 0){
                    paginationStgPosition.value.totalPages = paginationStgPosition.value.totalRecords / paginationStgPosition.value.page_size || 0
                } else {
                    paginationStgPosition.value.totalPages = Math.floor(paginationStgPosition.value.totalRecords / paginationStgPosition.value.page_size) + 1 || 0
                }
            }

        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    // addEditWebhookPosition function edit matrix_errors
    async function addEditWebhookPosition(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }
    getWebhookPositions();
    async function deletePositions(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting position:', error);
            throw error;
        }
    }

    getWebhookPositions()

    return {
        getWebhookPositions,
        getWebhookPositionsByStrategy,
        deletePositions,
        webhookPositions,
        webhookPositionsByStrategy,
        showEditPositionsModal,
        showWebhookPositionsModal,
        positionsWebhookStrategyId,
        addEditWebhookPosition,
        editPositionData,
        idForDelete,
        showMoreInfoId,
        showDeleteConfirmationModal,
        endpoint,
        state,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,

        paginationStgPosition
    };
});
