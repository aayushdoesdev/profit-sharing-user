import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";


export const useSignalOrdersStore = defineStore('signal_orders', () => {
    
    const endpoint='signalOrders'
    const wait=0
    const signalOrders = ref([]);
    const signalOrdersByUser = ref([]);
    const signalOrdersByBroker = ref([]);
    const showSignalOrdersModal = ref(false);
    let showAddEditSignalModal = ref(false);
    const editSignalOrderData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);

    const ordersSignalId = ref(0);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getSignalOrders() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            
            if(response.data){
                if(response.data.orders){
                    signalOrders.value = response.data.orders;
                } else {
                    signalOrders.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = signalOrders.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                signalOrders.value = [];
            }
        } catch (error) {
            console.error('Error fetching signal orders:', error);
            throw error;
        }
    }

    async function getSignalOrdersByUser(id, subEndpoint) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                signalOrdersByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    async function getSignalOrdersByBroker(id, subEndpoint='broker') {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                signalOrdersByBroker.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }


    // addEditSignalOrder function edit signal_orders
    async function addEditSignalOrder(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching signal_orders:', error);
            throw error;
        }
    }

    // deleteSignalOrder function delete SignalOrder from db
    async function deleteSignalOrder(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting SignalOrder:', error);
            throw error;
        }
    }

    getSignalOrders();

    return {
        getSignalOrders,
        getSignalOrdersByUser,
        getSignalOrdersByBroker,
        signalOrders,
        signalOrdersByUser,
        signalOrdersByBroker,
        showAddEditSignalModal,
        showSignalOrdersModal,
        addEditSignalOrder,
        editSignalOrderData,
        ordersSignalId,
        endpoint,
        state,
        
        deleteSignalOrder,
        showDeleteConfirmationModal,
        idForDelete,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});
