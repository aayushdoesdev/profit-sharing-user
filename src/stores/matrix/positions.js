import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import { useTickerStore } from './ticker/ticker'



export const usePositionsStore = defineStore('positions', () => {
    const tickerStore = useTickerStore();
    const endpoint='positions'
    const wait=0
    const positions = ref([]);
    const positionsByUser = ref([]);
    const matrixPositionsByStgId = ref([]);
    let showEditPositionsModal = ref(false);
    const showAddPositionsModal = ref(false);
    const editPositionData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([100, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const pageSize = ref(100);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 

    const searchByUser = ref("Select User")
    const searchByBroker = ref("Select Broker")
    const searchByStrategy = ref("Select Strategy")

    async function getPositions() {
        try {
            var page_id = currentPageNumber.value
            var page_size = pageSize.value //selectPageOptions.value[0]
            var search = searchInputText.value
            var user_id = searchByUser.value==="Select User"?"": searchByUser.value
            var broker_id = searchByBroker.value==="Select Broker"?"": searchByBroker.value
            var strategy_id = searchByStrategy.value==="Select Strategy"?"": searchByStrategy.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search, user_id, broker_id, strategy_id}, wait);
            if(response.data){
                if (response.data.positions){
                    positions.value = response.data.positions//.sort((b, a) => a.id - b.id);
                    let tokensList = []
                    for (let i = 0; i < positions.value.length; i++) {
                        tokensList.push(positions.value[i].instrument_token)
                    }
                    tickerStore.updateTickerList(tokensList)

                    totalRecords.value = response.data.count;
                    showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                    showEndRecords.value = positions.value.length + (currentPageNumber.value-1) * page_size 
                    if(totalRecords.value % page_size == 0){
                        totalPages.value = totalRecords.value / page_size 
                    } else {
                        totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                    }
                } else {
                    positions.value = [];
                    totalRecords.value = 0;
                    showStartRecords.value = 1
                    showEndRecords.value = 0
                    totalPages.value = 0
                }

            } else {
                positions.value = [];
            }



        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    async function getPositionsByUser(id) {
        try {            
            const subEndpoint = 'user'
            const page_id = 1
            const page_size = 10
            const response = await makeRequest(endpoint, "GET",{}, {}, { },wait, id, subEndpoint );
            if (response.data){
                positionsByUser.value = response.data//.sort((a, b) => b.id-a.id );;

                // to add token to ticker
                let tokensList = []
                for (let i = 0; i < positionsByUser.value.length; i++) {
                    tokensList.push(positionsByUser.value[i].instrument_token)
                }
                tickerStore.updateTickerList(tokensList)
            }

        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    async function getMatrixPositionsByStgId(strategy_id) {
        try {
            var page_id = currentPageNumber.value
            var page_size = 20
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {strategy_id, page_id, page_size},wait, subEndpoint );
            if (response.data.positions){
                matrixPositionsByStgId.value = response.data.positions || [];
                matrixPositionsByStgId.value//.sort((a, b) => b.id-a.id ); 

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = matrixPositionsByStgId.value.length + (currentPageNumber.value-1) * page_size 
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }


                let tokensList = []
                for (let i = 0; i < matrixPositionsByStgId.value.length; i++) {
                    tokensList.push(matrixPositionsByStgId.value[i].instrument_token)
                }
                tickerStore.updateTickerList(tokensList)

            } else {
                matrixPositionsByStgId.value = [];
            }

        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    // addEditPosition function edit positions
    async function addEditPosition(id,formdata) {
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

    // deletePositions function delete Positions from db
    async function deletePositions(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting position:', error);
            throw error;
        }
    }


    async function downloadCSVPositions(id) {
        try {
            const response = await makeRequest('positionCSVData', "GET",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting position:', error);
            throw error;
        }
    }

    getPositions();

    return {
        getPositions,
        getPositionsByUser,
        getMatrixPositionsByStgId,
        positions,
        positionsByUser,
        matrixPositionsByStgId,
        showEditPositionsModal,
        showAddPositionsModal,
        addEditPosition,
        editPositionData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deletePositions,
        downloadCSVPositions,

        searchByUser,
        searchByBroker,
        searchByStrategy,
        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        pageSize,
        totalPages,
        currentPageRecords,        
    };
});
