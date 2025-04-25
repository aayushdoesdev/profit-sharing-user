import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSignalPositionsStore = defineStore('signal_positions', () => {
    
    const endpoint='signalPositions'
    const wait=0
    const signalPositions = ref([]);
    const signalPositionsByStrategy = ref([]);
    let showEditPositionsModal = ref(false);
    const showSignalPositionsModal = ref(false);
    const editPositionData = ref({});
    const positionsSignalId = ref(0);
    const idForDelete = ref(null);
    const showDeleteConfirmationModal = ref(null);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getSignalPositions() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            
            if(response.data){
                if(response.data.positions){
                    signalPositions.value = response.data.positions;
                } else {
                    signalPositions.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = signalPositions.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                signalPositions.value = [];
            }
        } catch (error) {
            console.error('Error fetching matrix positions:', error);
            throw error;
        }
    }

    async function getSignalPositionsByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                signalPositionsByStrategy.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    // addEditSignalPosition function edit matrix_errors
    async function addEditSignalPosition(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }
    getSignalPositions();
    async function deletePositions(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting position:', error);
            throw error;
        }
    }

    getSignalPositions()

    return {
        getSignalPositions,
        getSignalPositionsByStrategy,
        deletePositions,
        signalPositions,
        signalPositionsByStrategy,
        showEditPositionsModal,
        showSignalPositionsModal,
        positionsSignalId,
        addEditSignalPosition,
        editPositionData,
        idForDelete,
        showDeleteConfirmationModal,
        endpoint,
        state,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});
