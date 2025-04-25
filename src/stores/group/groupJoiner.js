import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useGroupJoinersStore = defineStore('groupJoiners', () => {
    
    const endpoint='groupJoiners'
    const wait=0
    const allGroupJoiners = ref([]);
    const groupJoiners = ref([]);
    let showGroupJoinersAddEditModal = ref(false);
    const editGroupJoinerData= ref({})
    const showDeleteConfirmationModal = ref(false);
    const idForDelete = ref(0);
    const showMoreInfoId = ref(0);
    const joinGroupId = ref(0);
    const getGroupJoinersId = ref(0);

    const searchInputText = ref('');
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


    async function getGroupJoiners() {
        try {
            var page_id = currentPageNumber.value
            var page_size = pageSize.value//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                if(response.data.joiners){
                    allGroupJoiners.value = response.data.joiners || [];
                } else {
                    allGroupJoiners.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = allGroupJoiners.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                allGroupJoiners.value = [];
            }

        } catch (error) {
            console.error('Error fetching group joiners:', error);
            throw error;
        }
    }
    
    async function deleteGroupJoin(id) {
        try {
            idForDelete.value=0;
            await makeRequest(endpoint, "DELETE",{}, {}, {},wait,id);
    
        } catch (error) {
            console.error('Error deleteting group joiner:', error);
            throw error;
        }
    }


    async function addEditGroupJoin(id,formdata) {
        try {
            if (!joinGroupId.value && id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},wait,id);
            }else {
                await makeRequest(endpoint, "POST",formdata, {}, {},wait,null);
            }
        } catch (error) {
            console.error('Error editing StrategyJoin:', error);
            throw error;
        }
    }


    async function getGroupJoinersByGroupId(id=0) {
        try {
            let params = {
                page_id: paginationStgJoiner.value.currentPageNumber,
                page_size: paginationStgJoiner.value.page_size,
                search: ''
            }
            const response = await makeRequest(endpoint, "GET",{}, {}, params, wait, id, 'strategy');
            if (response.data){
                groupJoiners.value = response.data?.joiners || []
                
                paginationStgJoiner.value.totalRecords = response.data.count || groupJoiners.value.length
                paginationStgJoiner.value.showStartRecords = 1 + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                paginationStgJoiner.value.showEndRecords = groupJoiners.value.length + (paginationStgJoiner.value.currentPageNumber-1) * paginationStgJoiner.value.page_size
                if((paginationStgJoiner.value.totalRecords % paginationStgJoiner.value.page_size) == 0){
                    paginationStgJoiner.value.totalPages = paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size || 0
                } else {
                    paginationStgJoiner.value.totalPages = Math.floor(paginationStgJoiner.value.totalRecords / paginationStgJoiner.value.page_size) + 1 || 0
                }
            }else{
                groupJoiners.value = [];
            }
    
        } catch (error) {
            console.error('Error in get group Join:', error);
            throw error;
        }
    }

    getGroupJoiners()

    return {
        allGroupJoiners,
        groupJoiners,
        deleteGroupJoin,
        showGroupJoinersAddEditModal,
        addEditGroupJoin,
        editGroupJoinerData,
        endpoint,
        state,
        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId,
        joinGroupId,
        getGroupJoiners,
        getGroupJoinersId,
        getGroupJoinersByGroupId,

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