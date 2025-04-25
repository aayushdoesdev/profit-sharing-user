import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import  router  from "@/router/index";



export const useCurrentOrdersStore = defineStore('currentOrders', () => {
    
    const endpoint='currentOrders'
    const wait=0
    const currentOrders = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showEditCurrentModal = ref(false);
    const editCurrentOrderData = ref({});

    const page_id = 1
    const page_size = 100

    async function GetMatOrdersUsingStatus() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait,0, "by_status");
            if (response.data){
                currentOrders.value = response.data.orders || [];
            } else {
                currentOrders.value = [];
            }
        } catch (error) {
            console.error('Error deleteting MatrixOrder:', error);
            throw error;
        }
    }

    // async function getCurrentOrders() {
    //     console.log("Get current orders called");
    //     try {
    //         const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
    //         if (response.data){
    //             currentOrders.value = response.data.orders || [];
    //         } else {
    //             currentOrders.value = [];
    //         }

    //     } catch (error) {
    //         console.error('Error fetching currentOrders:', error);
    //         throw error;
    //     }
    // }

    // editCurrentOrder function edit currentOrders
    async function editCurrentOrder(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching currentOrders:', error);
            throw error;
        }
    }


    function autoCall (){
        setTimeout(() => {
            if(router.currentRoute.value.name === 'current-orders'){
                GetMatOrdersUsingStatus()
            }
        }, 30000)
    }

    

    GetMatOrdersUsingStatus();

    return {
        autoCall,
        GetMatOrdersUsingStatus,
        currentOrders,
        state,
        endpoint,

        editCurrentOrder, 
        showEditCurrentModal,
        editCurrentOrderData, 
        showDeleteConfirmationModal, 
        idForDelete,

    };
});