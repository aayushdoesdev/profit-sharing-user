import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSalesUserStore = defineStore('salesUser', () => {
    
    const endpoint='salesUser'
    const wait=0
    const salesUser = ref([]);
    const userDetailsById = ref([]);
    const showUserDetails = ref(false);
    const showInvoiceReceiptModal = ref(false);
    const invoiceData = ref({});

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);   
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 


    async function getSalesUser() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 10
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                if(response.data.users){
                    salesUser.value = response.data.users;
                } else {
                    salesUser.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = salesUser.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                salesUser.value = [];
            }


        } catch (error) {
            console.error('Error fetching salesUser:', error);
            throw error;
        }
    }

    async function getSalesUserDataById(id) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},0,id);
            if(response.data){
                if (response.data.invoice){
                    userDetailsById.value = response.data.invoice;
                } else {
                    userDetailsById.value = [];
                }
            }
        } catch (error) {
            console.error('Error fetching salesUser:', error);
            throw error;
        }   
    }


    // deleteSalesUser function delete salesUser from db
    async function deleteSalesUser(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting salesUser:', error);
            throw error;
        }
    }


    // editSalesUser function edit salesUser
    async function editSalesUser(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching salesUser:', error);
            throw error;
        }
    }


    getSalesUser();

    return {
        getSalesUser,
        getSalesUserDataById,
        salesUser,
        state,
        endpoint,
        userDetailsById,
        showUserDetails,
        showInvoiceReceiptModal,
        invoiceData,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});