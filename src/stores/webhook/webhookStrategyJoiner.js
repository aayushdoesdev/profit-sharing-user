import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookJoinerStore = defineStore('webhook_joiners', () => {
    
    const endpoint='webhookStrategyJoiner'
    const wait=0
    const webhookJoiners = ref([]);
    const webhookJoinersByStrategy = ref([]);
    const webhookJoinersByUser = ref([]);
    const filteredBrokersData = ref([]);
    const showEditWebhookModal = ref(false);
    const editWebhookJoinerData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const paginationStgJoiner = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })

    async function getWebhookJoiners() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                if(response.data.joiners){
                    webhookJoiners.value = response.data.joiners || [];
                } else {
                    webhookJoiners.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookJoiners.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                webhookJoiners.value = [];
            }

        } catch (error) {
            console.error('Error fetching webhook joiners:', error);
            throw error;
        }
    }

    async function getWebhookJoinersByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgJoiner.value.currentPageNumber
                params.page_size = paginationStgJoiner.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params,wait, id, subEndpoint);
            if (response.data){
                webhookJoinersByStrategy.value = response.data?.joiners || [];

                paginationStgJoiner.value.totalRecords = response.data.count || webhookJoinersByStrategy.value.length
                paginationStgJoiner.value.showStartRecords = 1 + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                paginationStgJoiner.value.showEndRecords = webhookJoinersByStrategy.value.length + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                if((paginationStgJoiner.value.totalRecords % paginationStgJoiner.value.page_size) == 0){
                    paginationStgJoiner.value.totalPages = paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size || 0
                } else {
                    paginationStgJoiner.value.totalPages = Math.floor(paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size) + 1 || 0
                }
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }
    }

    async function getWebhookJoinersByUserId(id) {
        
        try {
            const subEndpoint = 'user'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                webhookJoinersByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }        
    }

    // addEditWebhookJoiner function edit webhook_joiners
    async function addEditWebhookJoiner(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching webhook_joiners:', error);
            throw error;
        }
    }

    // deleteWebhookJoiner function delete joiner from db
    async function deleteWebhookJoiner(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting joiner:', error);
            throw error;
        }
    }

    // getWebhookJoiners();

    return {
        getWebhookJoiners,
        getWebhookJoinersByStrategy,
        getWebhookJoinersByUserId,
        webhookJoiners,
        webhookJoinersByStrategy,
        webhookJoinersByUser,
        showEditWebhookModal,
        addEditWebhookJoiner,
        editWebhookJoinerData,
        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deleteWebhookJoiner,
        filteredBrokersData,

        endpoint,
        state,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,

        paginationStgJoiner
    };
});