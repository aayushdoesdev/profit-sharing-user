import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";
import { useTickerStore } from "@/stores/matrix/ticker/ticker";



export const useManualPaperPositionsStore = defineStore('manualPaperPositions', () => {
    const tickerStore = useTickerStore();
    
    const endpoint='manualPaperPositions'
    const wait=0
    const manualPaperPositionsList = ref([]);
    const groupPaperPositions = ref([]);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const pageSize = ref(100);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 
    const showMoreInfoId = ref(0);

    const paginationStgPosition = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })

    
    async function getManualPaperPositions() {
        try {
            var page_id = currentPageNumber.value
            var page_size = pageSize.value //selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id,page_size,search},wait);
            if (response.data){
                manualPaperPositionsList.value = response.data?.data || [];

                let tokensList = []
                for (let i = 0; i < manualPaperPositionsList.value.length; i++) {
                    tokensList.push(manualPaperPositionsList.value[i].instrument_token)
                }
                tickerStore.updateTickerList(tokensList)

                totalRecords.value = response.data.count || manualPaperPositionsList.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = manualPaperPositionsList.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            }else{
                manualPaperPositionsList.value = [];
            }

        } catch (error) {
            manualPaperPositionsList.value = [];
            console.error('Error fetching  positions:', error);
            throw error;
        }
    }

    async function getGroupPaperByGroupId(id=0) {
        try {
            let params = {
                page_id: paginationStgPosition.value.currentPageNumber,
                page_size: paginationStgPosition.value.page_size,
                search: ''
            }

            const response = await makeRequest(endpoint, "GET",{}, {}, params, wait, id, 'strategy');
            if (response.data){
                groupPaperPositions.value = response.data

                paginationStgPosition.value.totalRecords = response.data.count || groupPaperPositions.value.length
                paginationStgPosition.value.showStartRecords = 1 + (paginationStgPosition.value.currentPageNumber-1) * paginationStgPosition.value.page_size
                paginationStgPosition.value.showEndRecords = groupPaperPositions.value.length + (paginationStgPosition.value.currentPageNumber-1) * paginationStgPosition.value.page_size
                if((paginationStgPosition.value.totalRecords % paginationStgPosition.value.page_size) == 0){
                    paginationStgPosition.value.totalPages = paginationStgPosition.value.totalRecords / paginationStgPosition.value.page_size || 0
                } else {
                    paginationStgPosition.value.totalPages = Math.floor(paginationStgPosition.value.totalRecords / paginationStgPosition.value.page_size) + 1 || 0
                }
                
            }else{
                groupPaperPositions.value = [];
            }
    
        } catch (error) {
            console.error('Error in get group paper positions:', error);
            throw error;
        }
    }



    getManualPaperPositions();

    return {
        getManualPaperPositions,
        getGroupPaperByGroupId,
        manualPaperPositionsList,
        groupPaperPositions,
        endpoint,
        state,        

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        pageSize,
        totalPages,
        currentPageRecords,

        paginationStgPosition,
        showMoreInfoId
    };
});