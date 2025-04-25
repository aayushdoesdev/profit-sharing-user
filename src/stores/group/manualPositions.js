import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";
import { useTickerStore } from "@/stores/matrix/ticker/ticker";



export const useManualPositionsStore = defineStore('manualPositions', () => {
    const tickerStore = useTickerStore();
    
    const endpoint='manualPositions'
    const wait=0
    const manualPositionsList = ref([]);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const pageSize = ref(100);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 
    const showMoreInfoId = ref(0);

    let showSqOffPositionModal = ref(false);
    const selectedPositions = ref([]);
    const selectAll = ref(false);
    let sqoffData = ref({ "positions": [], "master_order_id": 0 });
    
    async function getManualPositions(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
        }
        try {
            var page_id = currentPageNumber.value
            var page_size = pageSize.value //selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id,page_size,search},wait);
            if (response.data){
                manualPositionsList.value = response.data?.positions || [];

                let tokensList = []
                for (let i = 0; i < manualPositionsList.value.length; i++) {
                    tokensList.push(manualPositionsList.value[i].instrument_token)
                }
                tickerStore.updateTickerList(tokensList)

                totalRecords.value = response.data.count || manualPositionsList.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = manualPositionsList.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            }else{
                manualPositionsList.value = [];
            }

        } catch (error) {
            manualPositionsList.value = [];
            console.error('Error fetching  positions:', error);
            throw error;
        }
    }


    async function sqOffPosition() {
        sqoffData.value.positions = selectedPositions.value
        try {
          await makeRequest(endpoint, "POST", sqoffData.value, {}, {}, 0, null);
          return "success"
    
        } catch (error) {
          console.error('Error sqoff webhook position:', error);
          throw error;
        } finally{
            getManualPositions();
          selectAll.value = false
          sqoffData.value = { "positions": [], "master_order_id": 0 };
          selectedPositions.value = [];
        }
      }


    getManualPositions();

    return {
        getManualPositions,
        manualPositionsList,
        endpoint,
        state,

        sqOffPosition,
        showSqOffPositionModal,
        selectedPositions,
        selectAll,
        sqoffData,
        

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        pageSize,
        totalPages,
        currentPageRecords,
        showMoreInfoId,
    };
});