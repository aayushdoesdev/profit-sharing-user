import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixPlanStrategyStore = defineStore('matrixPlanStrategy', () => {
    
    const endpoint='matrixPlanStrategy'
    const wait=0
    const matrixPlanStrategy = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref({});
    const showAddEditModal = ref(false);
    const showAddPlanModal = ref(false);
    const editMatrixPlanStrategyData = ref({});
    const planStrategiesByPlanId = ref([]);
    const planStrategiesData = ref([]);

    const showStrategiesModal = ref(false);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 

    async function getMatrixPlanStrategy() {
        try {
            // var page_id = currentPageNumber.value
            // var page_size = 100//selectPageOptions.value[0]
            // var search = searchInputText.value

            // const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            // if (response.data){

            //     matrixPlanStrategy.value = response.data;


            //     totalRecords.value =  matrixPlanStrategy.value.length;// response.data.count;
            //     showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
            //     showEndRecords.value = matrixPlanStrategy.value.length + (currentPageNumber.value-1) * page_size
            //     if(totalRecords.value % 10 == 0){
            //         totalPages.value = totalRecords.value / 10 
            //     } else {
            //         totalPages.value = Math.floor(totalRecords.value / 10) + 1
            //     }
            // } else {
            //     matrixPlanStrategy.value = [];
            // }

        } catch (error) {
            console.error('Error fetching matrixPlanStrategy:', error);
            throw error;
        }
    }

    async function getPlanStrategiesByPlanId(id) {
        try {
            const subEndpoint = 'product'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                planStrategiesByPlanId.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies from product id:', error);
            throw error;
        }
    }

    // deleteMatrixPlanStrategy function delete matrixPlanStrategy from db
    async function deleteMatrixPlanStrategy(paramSet) {
        try {
            await makeRequest(endpoint, "DELETE",{}, {}, {}, 0, paramSet.id);
        } catch (error) {
            console.error('Error deleteting matrixPlanStrategy:', error);
            throw error;
        }
    }


    // editMatrixPlanStrategy function edit matrixPlanStrategy
    async function addEditMatrixPlanStrategy(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrixPlanStrategy:', error);
            throw error;
        }
    }


    // getMatrixPlanStrategy();

    return {
        getMatrixPlanStrategy,
        getPlanStrategiesByPlanId,
        matrixPlanStrategy,
        planStrategiesByPlanId,
        planStrategiesData,
        state,
        endpoint,
        
        addEditMatrixPlanStrategy, 
        showAddEditModal, 
        showAddPlanModal,
        editMatrixPlanStrategyData, 
        
        showDeleteConfirmationModal, 
        idForDelete,
        deleteMatrixPlanStrategy,
        showStrategiesModal,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});