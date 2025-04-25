import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";


export const useWebhookOrdersStore = defineStore('webhook_orders', () => {
    
    const endpoint='webhookOrders'
    const wait=0
    const webhookOrders = ref([]);
    const webhookOrdersByUser = ref([]);
    const webhookOrdersByBroker = ref([]);
    const showWebhookOrdersModal = ref(false);
    let showAddEditWebhookModal = ref(false);
    const editWebhookOrderData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const ordersWebhookStrategyId = ref(0);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const paginationStgOrder = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })

    async function getWebhookOrders() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            
            if(response.data){
                if(response.data.orders){
                    webhookOrders.value = response.data.orders;
                } else {
                    webhookOrders.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookOrders.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                webhookOrders.value = [];
            }
        } catch (error) {
            console.error('Error fetching webhook orders:', error);
            throw error;
        }
    }

    async function getWebhookOrdersByUser(id, subEndpoint) {
        try {
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgOrder.value.currentPageNumber
                params.page_size = paginationStgOrder.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params, wait, id, subEndpoint);
            if (response.data){
                webhookOrdersByUser.value = response.data;

                if(subEndpoint === 'strategy') {
                    webhookOrdersByUser.value = response.data?.orders || [];
                    paginationStgOrder.value.totalRecords = response.data.count || webhookOrdersByUser.value.length

                    paginationStgOrder.value.showStartRecords = 1 + (paginationStgOrder.value.currentPageNumber-1) * paginationStgOrder.value.page_size
                    paginationStgOrder.value.showEndRecords = webhookOrdersByUser.value.length + (paginationStgOrder.value.currentPageNumber-1) * paginationStgOrder.value.page_size
                    if((paginationStgOrder.value.totalRecords % paginationStgOrder.value.page_size) == 0){
                        paginationStgOrder.value.totalPages = paginationStgOrder.value.totalRecords / paginationStgOrder.value.page_size || 0
                    } else {
                        paginationStgOrder.value.totalPages = Math.floor(paginationStgOrder.value.totalRecords / paginationStgOrder.value.page_size) + 1 || 0
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    async function getWebhookOrdersByBroker(id, subEndpoint='broker') {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                webhookOrdersByBroker.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }


    // addEditWebhookOrder function edit webhook_orders
    async function addEditWebhookOrder(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching webhook_orders:', error);
            throw error;
        }
    }

    // deleteWebhookOrder function delete WebhookOrder from db
    async function deleteWebhookOrder(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting WebhookOrder:', error);
            throw error;
        }
    }

    getWebhookOrders();

    return {
        getWebhookOrders,
        getWebhookOrdersByUser,
        getWebhookOrdersByBroker,
        webhookOrders,
        webhookOrdersByUser,
        webhookOrdersByBroker,
        showAddEditWebhookModal,
        showWebhookOrdersModal,
        addEditWebhookOrder,
        editWebhookOrderData,
        ordersWebhookStrategyId,
        endpoint,
        state,
        
        deleteWebhookOrder,
        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,

        paginationStgOrder
    };
});
