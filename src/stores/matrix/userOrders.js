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

    const ordersWebhookStrategyId = ref(0);

    const page_id=1
    const page_size=100


    async function getWebhookOrders() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                webhookOrders.value = response.data['orders'];
            } else{
                webhookOrders.value = [];
            }

        } catch (error) {
            console.error('Error fetching webhook orders:', error);
            throw error;
        }
    }

    async function getWebhookOrdersByUser(id, subEndpoint) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                webhookOrdersByUser.value = response.data;
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
        idForDelete
    };
});
