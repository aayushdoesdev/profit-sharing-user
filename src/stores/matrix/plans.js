import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const usePlansStore = defineStore('plans', () => {
    // plans named as product in backend
    const endpoint='plans'
    const wait=0
    const plans = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    const showAddEditModal = ref(false);
    const editPlanData = ref({});
    const copyProductsData = ref({});
    const showStrategiesModal = ref(false);

    const searchInputText = ref('');
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 

    async function getPlans() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100 //selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                plans.value = response.data.sort((a, b) => a.id - b.id);                
                totalRecords.value =  plans.value.length;// response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = plans.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                plans.value = []
            }

        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // deletePlan function delete Plan from db
    async function deletePlan(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting product:', error);
            throw error;
        }
    }


    // editPlan function edit Plan
    async function editPlan(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }


    getPlans();

    return {
        getPlans,
        plans,
        state,
        endpoint,
        
        editPlan, 
        showAddEditModal, 
        editPlanData, 
        
        showDeleteConfirmationModal, 
        idForDelete,
        showMoreInfoId,
        deletePlan,
        showStrategiesModal,
        copyProductsData,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});