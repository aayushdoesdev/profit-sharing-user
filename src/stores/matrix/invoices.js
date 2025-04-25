import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useInvoicesStore = defineStore('invoices', () => {
    
    const endpoint='invoices'
    const wait=0
    const invoices = ref([]);
    const invoicesByUser = ref([]);
    let showEditInvoicesModal = ref(false);
    const showInvoiceReceiptModal = ref(false);
    const invoiceData = ref({});
    const editInvoiceData= ref({});

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

    const showPaymentProofModal = ref(false);
    const paymentData = ref({});


    async function getInvoices() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                invoices.value = response.data.sort((a, b) => a.id - b.id);
            } else {
                invoices.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix orders:', error);
            throw error;
        }
    }

    async function getInvoicesByUser(id) {
        try {
            
            const subEndpoint = 'user'
            const page_id = 1
            const page_size = 10
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, user_id:id},wait,subEndpoint );
            if (response.data){
                invoicesByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditInvoice function edit invoices
    async function addEditInvoice(id,formdata) {
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

    // deleteInvoices function delete invoices from db
    async function deleteInvoices(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting invoice:', error);
            throw error;
        }
    }

    getInvoices();

    return {
        getInvoices,
        getInvoicesByUser,
        invoices,
        invoicesByUser,
        invoiceData,
        showEditInvoicesModal,
        showInvoiceReceiptModal,
        addEditInvoice,
        editInvoiceData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        deleteInvoices,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,

        showPaymentProofModal,
        paymentData
        
    };
});
