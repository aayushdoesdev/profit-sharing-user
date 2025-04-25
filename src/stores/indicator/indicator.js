import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useIndicatorsStore = defineStore('indicators', () => {
    
    const endpoint='indicators'
    const wait=0
    const indicators = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    const showAddEditModal = ref(false);
    const editIndicatorData = ref({});

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

    async function getIndicators() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100 //selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                indicators.value = response.data
                totalRecords.value =  indicators.value.length;// response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = indicators.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                indicators.value = []
            }

        } catch (error) {
            console.error('Error fetching indicators:', error);
            throw error;
        }
    }

    // deleteIndicator function delete Indicator from db
    async function deleteIndicator(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting Indicator:', error);
            throw error;
        }
    }


    // editIndicator function edit Indicator
    async function editIndicator(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching Indicator:', error);
            throw error;
        }
    }


    getIndicators();

    return {
        getIndicators,
        indicators,
        state,
        endpoint,
        
        editIndicator, 
        showAddEditModal, 
        editIndicatorData, 
        
        showDeleteConfirmationModal, 
        idForDelete,
        showMoreInfoId,
        deleteIndicator,
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