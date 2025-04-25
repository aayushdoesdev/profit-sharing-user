import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixJoinerStore = defineStore('matrix_joiners', () => {
    
    const endpoint='matrixStrategyJoiner'
    const wait=0
    const matrixJoiners = ref([]);
    let showEditJoinerModal = ref(false);
    const editMatrixJoinerData= ref({});
    const matrixJoinersByStrategy = ref([]);
    const matrixJoinersByUser = ref([]);
    const filteredBrokersData = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const pageSize = ref(100);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);

    const paginationStgJoiner = ref({
        page_id: 1,
        page_size: 50,
        totalRecords: 0,
        totalPages: 0,
        showStartRecords: 1,
        currentPageNumber: 1,
        showEndRecords: 0,
        currentPageRecords: 0
    })


    async function getMatrixJoiners() {
        try {
            var page_id = currentPageNumber.value
            var page_size = pageSize.value//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if(response.data){
                if(response.data.joiners){
                    matrixJoiners.value = response.data.joiners;
                } else {
                    matrixJoiners.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = matrixJoiners.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                matrixJoiners.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix joiners:', error);
            throw error;
        }
    }


    async function getMatrixJoinersByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            let params = {}
            if(subEndpoint === 'strategy') {
                params.page_id = paginationStgJoiner.value.currentPageNumber
                params.page_size = paginationStgJoiner.value.page_size
                params.search = ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {},params,wait, id, subEndpoint);
            if (response.data){
                matrixJoinersByStrategy.value = response.data?.joiners || [];
                
                paginationStgJoiner.value.totalRecords = response.data?.count || matrixJoinersByStrategy.value.length
                paginationStgJoiner.value.showStartRecords = 1 + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                paginationStgJoiner.value.showEndRecords = matrixJoinersByStrategy.value.length + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                if((paginationStgJoiner.value.totalRecords % paginationStgJoiner.value.page_size) == 0){
                    paginationStgJoiner.value.totalPages = paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size || 0
                } else {
                    paginationStgJoiner.value.totalPages = Math.floor(paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size) + 1 || 0
                }
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }
    }

    async function getMatrixJoinersByUserId(id) {
        try {
            const subEndpoint = 'user'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                matrixJoinersByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }        
    }



    // addEditMatrixJoiner function edit matrix_joiners
    async function addEditMatrixJoiner(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrix_joiners:', error);
            throw error;
        }
    }

    // deleteMatrixJoiner function delete joiner from db
    async function deleteMatrixJoiner(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting joiner:', error);
            throw error;
        }
    }

    getMatrixJoiners();

    return {
        getMatrixJoiners,
        getMatrixJoinersByStrategy,
        getMatrixJoinersByUserId,
        matrixJoiners,
        showEditJoinerModal,
        addEditMatrixJoiner,
        editMatrixJoinerData,
        filteredBrokersData,
        matrixJoinersByStrategy,
        matrixJoinersByUser,
        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        deleteMatrixJoiner,

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

        paginationStgJoiner
    };
});