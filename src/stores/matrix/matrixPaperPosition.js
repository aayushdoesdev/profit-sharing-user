import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixPaperPositionStore = defineStore('matrixPaperPosition', () => {
    
    const endpoint='matrixPaperPosition'
    const wait=0
    const matrixPaperPositions = ref([]);
    const matrixPaperPositionsByStgId = ref([]);
    let showEditMatrixPaperPositionModal = ref(false);
    const editMatrixPaperPositionData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([100, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);


    async function getMatrixPaperPositions() {
        // try {
        //     const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
        //     if (response.data){
        //         matrixPaperPositions.value = response.data;
        //     } else {
        //         matrixPaperPositions.value = [];
        //     }

        // } catch (error) {
        //     console.error('Error fetching paper Positions:', error);
        //     throw error;
        // }
    }

    async function getMatrixPaperPositionsByStgId(strategy_id) {
        try {
            var page_id = currentPageNumber.value
            var page_size = 20;
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {strategy_id, page_id, page_size},wait, subEndpoint);
            if (response.data.data){
                matrixPaperPositionsByStgId.value = response.data.data;
                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = matrixPaperPositionsByStgId.value.length + (currentPageNumber.value-1) * page_size 
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                matrixPaperPositionsByStgId.value = [];
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditMatrixPaperPosition function edit matrix_orders
    async function addEditMatrixPaperPosition(id,formdata) {
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

        // deleteMatrixPaperPosition function delete MatrixPaperPosition from db
        async function deleteMatrixPaperPosition(id) {
            try {
                idForDelete.value=null;
                await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
            } catch (error) {
                console.error('Error deleteting MatrixPaperPosition:', error);
                throw error;
            }
        }

    // getMatrixPaperPositions();

    return {
        getMatrixPaperPositions,
        getMatrixPaperPositionsByStgId,
        matrixPaperPositions,
        matrixPaperPositionsByStgId,
        showEditMatrixPaperPositionModal,
        addEditMatrixPaperPosition,
        editMatrixPaperPositionData,
        endpoint,
        state,

        deleteMatrixPaperPosition,
        showDeleteConfirmationModal,
        idForDelete,

        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
    };
});
