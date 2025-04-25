import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useGroupOrdersStore = defineStore('groupOrders', () => {
    
    const endpoint='groupOrders'
    const wait=0
    const groupOrdersList = ref([]);
    let showPlaceGroupOrderModal = ref(false);
    const modifyGroupOrderData= ref({})
    const groupIdForPlaceOrder = ref(0);
    const idForCancelOrder = ref(0);
    const showMoreInfoId = ref(0);
    const showCancelConfirmationModal = ref(false);
    const showModifyGroupOrderModal = ref(false);


    const showViewAllModal = ref(false)
    const viewAllData = ref({})

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 


    async function getGroupOrders(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
        }
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                groupOrdersList.value = response.data.orders? response.data.orders.sort((b, a) => a.id - b.id) : [];

                totalRecords.value = response.data.count || groupOrdersList.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = groupOrdersList.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }

            }else{
                groupOrdersList.value = [];
            }

        } catch (error) {
            console.error('Error fetching group orders:', error);
            throw error;
        }
    }


    async function placeGroupOrder(formdata) {
        try {
            await makeRequest('groupPlaceOrder', "POST",formdata, {}, {},wait,null);
            
           
        } catch (error) {
            console.error('Error add editing group order:', error);
            throw error;
        }
    }

    async function modifyGroupOrder(id, formdata) {
        try {
            if (id){
                await makeRequest('groupModifyOrder', "PUT",formdata, {}, {},wait,id);
            }else{
                console.error('id not found:');
            }
            
        } catch (error) {
            console.error('Error editing group order:', error);
            throw error;
        }
    }

    async function cancelGroupOrder(id) {
        try {
            idForCancelOrder.value=0;
            await makeRequest('groupCancelOrder', "PUT", {}, {}, {}, wait, id);

        } catch (error) {
            console.error('Error in cancel group order:', error);
            throw error;
        }
    }

    getGroupOrders();

    return {
        placeGroupOrder,
        getGroupOrders,
        modifyGroupOrder,
        cancelGroupOrder,
        groupOrdersList,
        showPlaceGroupOrderModal,
        modifyGroupOrderData,
        endpoint,
        state,
        groupIdForPlaceOrder,
        idForCancelOrder,
        showCancelConfirmationModal,
        showModifyGroupOrderModal,
        showViewAllModal,
        viewAllData,
        showMoreInfoId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});