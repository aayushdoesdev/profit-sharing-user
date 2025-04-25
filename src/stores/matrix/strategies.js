import { ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import { useTickerStore } from './ticker/ticker'



export const useStrategyStore = defineStore('strategies', () => {
    const tickerStore = useTickerStore();
    const endpoint='strategies'
    const wait=0
    const strategies = ref([]);
    const strategiesById = ref([]);
    const strategiesByPlanId = ref([]);
    let requested = ref([]);
    const ignoreId = ref([]);

    const strategyData  = ref(null)

    let showAddEditModal = ref(false);
    let showSqOffStrgyPosModal = ref(false);
    const stocksSqoff = ref(false)

    const strgyIdForSqoff = ref(null);
    const editStrategyData= ref({})
    const storePlanId = ref(0);
    const storePlanData = ref({});
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const storeStrategyId = ref(0);
    const storeUserId = ref(0);
    const showJoinersModal = ref(false);

    const showPositionsModal = ref(false);
    const showPaperPositionModal = ref(false);
    const showStgPaperPositionModal = ref(false);
    const showMatrixPositionModal = ref(false);
    const showDemoPositionModal = ref(false);
    const showMatrixPaperOrdersModal = ref(false); 
    const paperPositionStrategyId = ref(0);

    const showOrdersModal = ref(false); // To Open Optional Orders Modal
    const showWebhookOrdersModal = ref(false); // To Open Webhook Orders Modal
    const showMatrixOrdersModal = ref(false); // To Open Matrix Orders Modal
    const ordersStrategyId = ref(0);
    
    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const editExpiryModal = ref(false);

    const strgyPosDataForSqoff = ref({}); 
    const storePnl = ref({});


    async function getStrategies() {
        try {
            var search = searchInputText.value

            let response = await makeRequest(endpoint, "GET",{}, {}, {search},wait);
            
            if (response.data){

                strategies.value = response.data || [] //.sort((a, b) => a.id - b.id) || [];
                totalRecords.value = strategies.value.length;

                const tokensList = strategies.value.flatMap(strategy => 
                    strategy.paper_positions.map(pos => pos.instrument_token)
                );
                
                let tempData = strategies.value
                for (let i = 0; i < strategies.value.length; i++) {
                    tempData[i].pnl =  ((strategies.value[i].exit_price - strategies.value[i].entry_price) * strategies.value[i].qty) || 0
                }
                tickerStore.updateTickerList(tokensList)

                strategies.value = tempData
            } else {
                strategies.value = [];
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    async function getStrategiesById(id) {
        if(!requested.value.includes(id) && ignoreId.value.includes(id)) {
            requested.value.push(id);        
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const isExists = strategies.value.some(stg => stg.id === response.data.id);
    
                    if (!isExists) {
                        strategies.value.push(response.data);
                    }
                } else if(response.data == null) {
                    ignoreId.value.push(id);
                }
            } catch (error) {
                ignoreId.value.push(id);
                throw error;
            } finally {
                requested.value.pop(); // Cleanup logic
            }
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async function getStrategiesByPlanId(id) {
        try {
            const subEndpoint = 'plan'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                strategiesByPlanId.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies from plan id:', error);
            throw error;
        }
    }



    // deleteStrategy function delete Strategy from db
    async function deleteStrategy(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting Strategy:', error);
            throw error;
        }
    }


    // addEditStrategy function edit Strategy 
    async function addEditStrategy(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    async function sendSqoffStrategyPosReq(id) {
        try {
            await makeRequest("strtgposSqOff", "PUT",strgyPosDataForSqoff.value, {}, {},0,id);
        } catch (error) {
            console.error('Error in sendSqoffStrategyPosReq:', error);
            throw error;
        } finally {
            strgyPosDataForSqoff.value = {};
            stocksSqoff.value = false;
        }
    }

    watchEffect(() => {
        if(strategies.value && strategies.value.length > 0){
            let tempData = strategies.value
            tempData.forEach(stg => {
                const position = stg?.paper_positions || []
                if(position.length > 1){
                    stg.position_status = position[0].status === 'OPEN' || position[1].status === 'OPEN' ? 'OPEN' : 'CLOSED'
                } else if (position.length === 1){
                    stg.position_status = position[0].status === 'OPEN' ? 'OPEN' : 'CLOSED'
                } else {
                    stg.position_status = 'CLOSED'
                }
            })
            strategies.value = tempData
        }
    })

    getStrategies();

    return {
        getStrategies,
        getStrategiesById,
        getStrategiesByPlanId,
        strategies,

        strategyData,
        
        strategiesById,
        strategiesByPlanId,
        deleteStrategy,
        showAddEditModal,
        addEditStrategy,
        sendSqoffStrategyPosReq,
        strgyIdForSqoff,
        editStrategyData,
        storePlanId,
        storePlanData,
        endpoint,
        state,
        showDeleteConfirmationModal,
        showSqOffStrgyPosModal,
        stocksSqoff,
        strgyPosDataForSqoff,
        idForDelete,
        showMoreInfoId,

        storeUserId,
        storeStrategyId,
        showJoinersModal,

        showPositionsModal,
        showPaperPositionModal,
        showStgPaperPositionModal,
        showMatrixPositionModal,
        showDemoPositionModal,
        showMatrixPaperOrdersModal,
        paperPositionStrategyId,

        showOrdersModal,
        showWebhookOrdersModal,
        showMatrixOrdersModal,
        ordersStrategyId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
        editExpiryModal,
        storePnl
    };
});