import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useInvoiceItemsStore = defineStore('invoiceItems', () => {
    
    const endpoint='invoiceItems'
    const wait=0
    const invoiceItems = ref([]);
    const invoiceItemsByUser = ref([]);
    let showEditInvoiceItemsModal = ref(false);
    const showInvoiceReceiptModal = ref(false);
    const invoiceItemData = ref({});
    const editInvoiceItemData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 


    async function getInvoiceItems() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                invoiceItems.value = response.data;
            } else {
                invoiceItems.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix orders:', error);
            throw error;
        }
    }

    async function getInvoiceItemsByUser(id) {
        try {
            
            const subEndpoint = 'user'
            const page_id = 1
            const page_size = 10
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, user_id:id},wait,subEndpoint );
            if (response.data){
                invoiceItemsByUser.value = response.data.sort((a, b) => a.id - b.id);
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditInvoiceItem function edit invoiceItems
    async function addEditInvoiceItem(id,formdata) {
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

    // deleteInvoiceItems function delete invoiceItems from db
    async function deleteInvoiceItems(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting invoiceItem:', error);
            throw error;
        }
    }

    getInvoiceItems();

    return {
        getInvoiceItems,
        getInvoiceItemsByUser,
        invoiceItems,
        invoiceItemsByUser,
        invoiceItemData,
        showEditInvoiceItemsModal,
        showInvoiceReceiptModal,
        addEditInvoiceItem,
        editInvoiceItemData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        deleteInvoiceItems,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
        
    };
});
