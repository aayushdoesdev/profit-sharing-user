import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useBrokerIndexStore = defineStore('brokers', () => {
    
    const endpoint='brokers'
    const wait=0
    const brokers = ref([]);
    const brokersById = ref([]);
    const brokersByUserId = ref([]);
    const isAutoCall = ref(true);
    let requested = ref([]);
    const ignoreId = ref([]);

    const brokerData  = ref(null)

    let showAddEditModal = ref(false);
    const editBrokerData= ref({})
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    
    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);
    

    const showOrdersModal = ref(false); // To Open Optional Orders Modal
    const showWebhookOrdersModal = ref(false); // To Open Webhook Orders Modal
    const showMatrixOrdersModal = ref(false); // To Open Matrix Orders Modal
    const ordersBrokerId = ref(0);
    const ordersUserId = ref(0);


    async function getBrokers(size = null) {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[1]
            var search = searchInputText.value
            
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
             
            if (response.data){
                if(response.data.brokers){
                    brokers.value = response.data.brokers.sort((a, b) => a.id - b.id);
                } else {
                    brokers.value = [];
                }
                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = brokers.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                brokers.value = [];
            }

        } catch (error) {
            console.error('Error fetching brokers:', error);
            throw error;
        }
    }

    async function getBrokersById(id) {
        if(!requested.value.includes(id) && !ignoreId.value.includes(id)) {
            requested.value.push(id);
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const isExists = brokers.value.some(broker => broker.id === response.data.id);
    
                    if (!isExists) {
                        brokers.value.push(response.data);
                    }
                } else if(response.data == null) {
                    ignoreId.value.push(id);
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

    async function getBrokersByUserId(id) {      
        try {
            let subEndPoint='user'
            const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id, subEndPoint);
            if (response.data) {
                brokersByUserId.value = response.data
            } else {
                brokersByUserId.value = []
            }
        } catch (error) {
            console.error('Error fetching brokers:', error);
            throw error;
        } 
    }


    // deleteBroker function delete broker from db
    async function deleteBroker(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting broker:', error);
            throw error;
        }
    }


    // addEditBroker function edit broker
    async function addEditBroker(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching brokers:', error);
            throw error;
        }
    }

    if(isAutoCall.value){
        getBrokers();
        isAutoCall.value = false
    }

    return {
        getBrokers,
        getBrokersById,
        getBrokersByUserId,
        brokers,
        brokersById,

        brokerData, 


        brokersByUserId,
        deleteBroker,
        showAddEditModal,
        addEditBroker,
        editBrokerData,
        endpoint,
        state,
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

        showOrdersModal,
        showWebhookOrdersModal,
        showMatrixOrdersModal,
        ordersBrokerId,
        ordersUserId,

    };
});