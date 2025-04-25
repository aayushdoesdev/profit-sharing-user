import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixAlertsStore = defineStore('matrix_alerts', () => {
    
    const endpoint='matrixAlerts'
    const wait=0
    const matrixAlerts = ref([]);
    const matrixAlertsByStrategy = ref([]);
    let showEditMatrixModal = ref(false);
    const showAlertsModal = ref(false);
    const editMatrixAlertData= ref({});

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getMatrixAlerts() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                if(response.data){
                    matrixAlerts.value = response.data || [];
                } else {
                    matrixAlerts.value = [];
                }

                totalRecords.value = response.data.Count || matrixAlerts.value.length;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = matrixAlerts.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                matrixAlerts.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix alerts:', error);
            throw error;
        }
    }

    async function getMatrixAlertsByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                matrixAlertsByStrategy.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching alert:', error);
            throw error;
        }
    }

    // addEditMatrixAlert function edit matrix_errors
    async function addEditMatrixAlert(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrix_alerts:', error);
            throw error;
        }
    }

    getMatrixAlerts();

    return {
        getMatrixAlerts,
        getMatrixAlertsByStrategy,
        matrixAlerts,
        matrixAlertsByStrategy,
        showEditMatrixModal,
        showAlertsModal,
        addEditMatrixAlert,
        editMatrixAlertData,
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
