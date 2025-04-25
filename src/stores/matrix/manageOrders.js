import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useManageOrdersStore = defineStore('manageOrders', () => {
    
    const endpoint='manageOrders'
    const wait=0
    const manageOrders = ref([]);
    const manageOrdersById = ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showOrdersModal = ref(false);
    const editManageOrderData = ref({});
    const showUserInfo = ref({});
    const showUserInfoModal = ref(false);

    const page_id = 1
    const page_size = 100

    async function getManageOrders() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                manageOrders.value = response.data;
            } else {
                manageOrders.value = [];
            }

        } catch (error) {
            console.error('Error fetching manageOrders:', error);
            throw error;
        }
    }

    // by id 
    async function getManageOrdersById(id) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id);
            if (response.data){
                manageOrdersById.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching manageOrders:', error);
            throw error;
        }
    }

    // editManageOrder function edit manageOrders
    async function editManageOrder(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching manageOrder:', error);
            throw error;
        }
    }


    getManageOrders();

    return {
        getManageOrders,
        getManageOrdersById,
        manageOrders,
        manageOrdersById,
        state,
        endpoint,

        showUserInfo,
        editManageOrder, 
        showOrdersModal,
        showUserInfoModal, 
        editManageOrderData, 
        
        showDeleteConfirmationModal, 
        idForDelete,

    };
});