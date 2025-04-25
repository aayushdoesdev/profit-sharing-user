import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useGroupAlertsStore = defineStore('groupAlerts', () => {
    
    const endpoint='groupAlerts'
    const wait=0
    const groupAlertsList = ref([]);

    const showCopyJsonModal  = ref(false)
    const copyJsonData = ref({})

    let page_id = 1;
    let page_size = 10;
    let search = '';
    
    async function getGroupAlerts(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
          }
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                groupAlertsList.value = response.data.sort((b, a) => a.id - b.id);
            }else{
                groupAlertsList.value = [];
            }

        } catch (error) {
            console.error('Error fetching group Alerts:', error);
            throw error;
        }
    }

    getGroupAlerts();
    return {
        getGroupAlerts,
        groupAlertsList,
        showCopyJsonModal,
        copyJsonData,
        endpoint,
        state
    };
});