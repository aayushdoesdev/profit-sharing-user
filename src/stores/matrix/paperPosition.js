import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import { useTickerStore } from './ticker/ticker';


export const usePaperPositionStore = defineStore('paperPosition', () => {
    const tickerStore = useTickerStore();
    const endpoint='paperPosition'
    const wait=0
    const paperPositions = ref([]);
    const paperPositionsByStgId = ref([]);
    let showEditPaperPositionModal = ref(false);
    const editPaperPositionData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    const page_id=1
    const page_size=100
    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([100, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);

    const paperType = ref('')

    async function getPaperPositions() {
        // try {
        //     const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
        //     if (response.data){
        //         paperPositions.value = response.data;
        //     } else {
        //         paperPositions.value = [];
        //     }

        // } catch (error) {
        //     console.error('Error fetching paper Positions:', error);
        //     throw error;
        // }
    }

    async function getPaperPositionsByStgId(strategy_id) {
        try {
            var page_id = currentPageNumber.value
            var page_size = 20;
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {strategy_id, page_id, page_size},wait, subEndpoint);
            if (response.data.data){
                paperPositionsByStgId.value = response.data.data || [];
                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = paperPositionsByStgId.value.length + (currentPageNumber.value-1) * page_size 
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }

                let tokensList = []
                for (let i = 0; i < paperPositionsByStgId.value.length; i++) {
                    tokensList.push(paperPositionsByStgId.value[i].instrument_token)
                }
                tickerStore.updateTickerList(tokensList)

            } else {
                paperPositionsByStgId.value = [];
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditPaperPosition function edit matrix_orders
    async function addEditPaperPosition(id,formdata) {
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

        // deletePaperPosition function delete PaperPosition from db
        async function deletePaperPosition(id) {
            try {
                idForDelete.value=null;
                await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
            } catch (error) {
                console.error('Error deleteting PaperPosition:', error);
                throw error;
            }
        }

    // getpaperPositions();

    return {
        getPaperPositions,
        getPaperPositionsByStgId,
        paperPositions,
        paperPositionsByStgId,
        showEditPaperPositionModal,
        addEditPaperPosition,
        editPaperPositionData,
        endpoint,
        state,

        deletePaperPosition,
        showDeleteConfirmationModal,
        idForDelete,

        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,

        paperType,
    };
});
