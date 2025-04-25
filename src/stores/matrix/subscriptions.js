import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSubscriptionsStore = defineStore('subscriptions', () => {
    
    const endpoint='subscriptions'
    const wait=0
    const subscriptions = ref([]);
    const subscriptionsByUser = ref([]);
    const subscriptionsUser = ref({"userName":"","id":""});
    let showEditSubscriptionsModal = ref(false);
    const editSubscriptionData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const searchByStatus = ref('PENDING')

    async function getSubscriptions() {
        try {
            let payment_status= searchByStatus.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {payment_status},wait);
            if (response.data){
                subscriptions.value = response.data;
            } else {
                subscriptions.value = [];
            }

        } catch (error) {    
            console.error('Error fetching subscriptions:', error);
            // throw error;
        }
    }

    async function getSubscriptionsByUser(id) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait,id, 'user');
            if (response.data){
                subscriptionsByUser.value = response.data;
            } else {
                subscriptionsByUser.value = [];
            }

        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            throw error;
        }
    }

    // addEditSubscription function edit subscriptions
    async function addEditSubscription(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            throw error;
        }
    }

    // deleteSubscriptions function delete subscription from db
    async function deleteSubscriptions(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting subscription:', error);
            throw error;
        }
    }

    getSubscriptions()

    return {
        getSubscriptions,
        getSubscriptionsByUser,
        subscriptions,
        subscriptionsByUser,
        showEditSubscriptionsModal,
        addEditSubscription,
        editSubscriptionData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deleteSubscriptions,
        subscriptionsUser,
        searchByStatus
        
    };
});
