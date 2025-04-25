import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useWebhookAlertsStore = defineStore('webhook_alerts', () => {
    
    const endpoint='webhookAlerts'
    const wait=0
    const webhookAlerts = ref([]);
    const webhookAlertsByStrategy = ref([]);
    let showEditMatrixModal = ref(false);
    const showAlertsModal = ref(false);
    const editWebhookAlertData= ref({});
    const showMoreInfoId = ref(0);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const paginationStgAlert = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })

    async function getWebhookAlerts() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                if(response.data?.webhook_alerts){
                    webhookAlerts.value = response.data?.webhook_alerts || [];
                } else {
                    webhookAlerts.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = webhookAlerts.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                webhookAlerts.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix alerts:', error);
            throw error;
        }
    }

    async function getWebhookAlertsByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgAlert.value.currentPageNumber
                params.page_size = paginationStgAlert.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params,wait, id, subEndpoint);
            if (response.data){
                webhookAlertsByStrategy.value = response.data?.webhook_alerts || [];

                paginationStgAlert.value.totalRecords = response.data.count || webhookAlertsByStrategy.value.length
                paginationStgAlert.value.showStartRecords = 1 + (paginationStgAlert.value.currentPageNumber-1) * paginationStgAlert.value.page_size
                paginationStgAlert.value.showEndRecords = webhookAlertsByStrategy.value.length + (paginationStgAlert.value.currentPageNumber-1) * paginationStgAlert.value.page_size
                if((paginationStgAlert.value.totalRecords % paginationStgAlert.value.page_size) == 0){
                    paginationStgAlert.value.totalPages = paginationStgAlert.value.totalRecords / paginationStgAlert.value.page_size || 0
                } else {
                    paginationStgAlert.value.totalPages = Math.floor(paginationStgAlert.value.totalRecords / paginationStgAlert.value.page_size) + 1 || 0
                }

            }

        } catch (error) {
            console.error('Error fetching alert:', error);
            throw error;
        }
    }

    // addEditWebhookAlert function edit matrix_errors
    async function addEditWebhookAlert(id,formdata) {
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

    getWebhookAlerts();

    return {
        getWebhookAlerts,
        getWebhookAlertsByStrategy,
        webhookAlerts,
        webhookAlertsByStrategy,
        showEditMatrixModal,
        showAlertsModal,
        addEditWebhookAlert,
        editWebhookAlertData,
        endpoint,
        state,
        showMoreInfoId,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
        paginationStgAlert
    };
});
