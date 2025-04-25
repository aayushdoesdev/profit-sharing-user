import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSignalStore = defineStore('signals', () => {
    
    const endpoint='signal'
    const wait=0
    const signals = ref([]);
    const signalsById = ref([]);
    let requested = ref([]);
    let showAddEditModal = ref(false);
    const editSignalData= ref({})
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const storeStrategyId = ref(0);
    const storeUserId = ref(0);
    const ignoreId = ref([])

    
    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getSignals() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);

            if(response.data){
                signals.value = response.data || [];
                
                totalRecords.value = response.data.count || signals.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = signals.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                signals.value = [];
            }

        } catch (error) {
            console.error('Error fetching signals:', error);
            throw error;
        }
    }


    async function getSignalsById(id) {
        if(!requested.value.includes(id) && ignoreId.value.includes(id)) {
            requested.value.push(id);  
            // debugger      
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const isExists = signals.value.some(wbStg => wbStg.id === response.data.id);
    
                    if (!isExists) {
                        signals.value.push(response.data);
                    } else if(response.data == null) {
                        ignoreId.value.push(id);
                    }
                }
            } catch (error) {
                ignoreId.value.push(id);
                throw error;
            } finally {
                requested.value.pop(); // Cleanup logic
            }
        } else {
            if(!requested.value.includes(id)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }


    // deleteSignal function delete Signal from db
    async function deleteSignal(id=0) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting Signal:', error);
            throw error;
        }
    }


    // addEditSignal function edit Signal
    async function addEditSignal(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching signals:', error);
            throw error;
        }
    }

    getSignals();

    return {
        getSignals,
        getSignalsById,
        signals,
        signalsById,
        deleteSignal,
        showAddEditModal,
        addEditSignal,
        editSignalData,
        endpoint,
        state,
        showDeleteConfirmationModal, 
        idForDelete,
        storeStrategyId,
        storeUserId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});