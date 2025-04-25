import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixOrdersStore = defineStore('matrix_orders', () => {
    
    const endpoint='matrixOrders'
    const wait=0
    const matrixOrders = ref([]);
    const matrixOrdersByUser = ref([]);
    const matrixOrdersByBroker = ref([]);
    let showEditMatrixModal = ref(false);
    const editMatrixOrderData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([100, 20, 30, 40, 500]);
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

    const searchByUser = ref("Select User")
    const searchByBroker = ref("Select Broker")
    const searchByStrategy = ref("Select Strategy") 


    async function getMatrixOrders() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            var user_id = searchByUser.value==="Select User"?"": searchByUser.value
            var broker_id = searchByBroker.value==="Select Broker"?"": searchByBroker.value
            var strategy_id = searchByStrategy.value==="Select Strategy"?"": searchByStrategy.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search, user_id, broker_id, strategy_id},wait);
            if (response.data){
                
                if(response.data.orders){
                    matrixOrders.value = response.data.orders;
                } else {
                    matrixOrders.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = matrixOrders.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                matrixOrders.value = [];
                totalRecords.value = 0;
                showStartRecords.value = 0
                showEndRecords.value = 0
                totalPages.value = 0
            }

        } catch (error) {
            console.error('Error fetching matrix orders:', error);
            throw error;
        }
    }

    async function getMatrixOrdersByUser(id, subEndpoint) {
        try {
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgOrder.value.currentPageNumber
                params.page_size = paginationStgOrder.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params, wait, id, subEndpoint);
            if (response.data){
                matrixOrdersByUser.value = response.data || [];
                // matrixOrdersByUser.value.sort((a, b) => b.id-a.id );
                if(subEndpoint === 'strategy') {
                    matrixOrdersByUser.value = response.data.orders || [];
                    paginationStgOrder.value.totalRecords = response.data.count || matrixOrdersByUser.value.length

                    paginationStgOrder.value.showStartRecords = 1 + (paginationStgOrder.value.currentPageNumber-1) * paginationStgOrder.value.page_size
                    paginationStgOrder.value.showEndRecords = matrixOrdersByUser.value.length + (paginationStgOrder.value.currentPageNumber-1) * paginationStgOrder.value.page_size
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

    async function getMatrixOrdersByBroker(id, subEndpoint='broker') {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                matrixOrdersByBroker.value = response.data || [];
                // matrixOrdersByBroker.value.sort((a, b) => b.id-a.id );    
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditMatrixOrder function edit matrix_orders
    async function addEditMatrixOrder(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrix_orders:', error);
            throw error;
        }
    }

    // deleteMatrixOrder function delete MatrixOrder from db
    async function deleteMatrixOrder(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting MatrixOrder:', error);
            throw error;
        }
    }

   

    // getMatrixOrders();

    return {
        getMatrixOrders,
        getMatrixOrdersByUser,
        getMatrixOrdersByBroker,
        matrixOrders,
        matrixOrdersByUser,
        matrixOrdersByBroker,
        showEditMatrixModal,
        addEditMatrixOrder,
        editMatrixOrderData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deleteMatrixOrder,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,

        paginationStgOrder,

        searchByUser,
        searchByBroker,
        searchByStrategy
    };
});
