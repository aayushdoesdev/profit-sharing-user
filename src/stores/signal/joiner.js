import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSignalJoinerStore = defineStore('signal_joiners', () => {
    
    const endpoint='signalJoiner'
    const wait=0
    const signalJoiners = ref([]);
    const signalJoinersByStrategy = ref([]);
    const signalJoinersByUser = ref([]);
    const filteredBrokersData = ref([]);
    const showEditSignalModal = ref(false);
    const editSignalJoinerData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0);


    async function getSignalJoiners() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if(response.data){
                if(response.data.joiners){
                    signalJoiners.value = response.data.joiners;
                } else {
                    signalJoiners.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = signalJoiners.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                signalJoiners.value = [];
            }

        } catch (error) {
            console.error('Error fetching signal joiners:', error);
            throw error;
        }
    }

    async function getSignalJoinersByStrategy(id) {
        try {
            const subEndpoint = 'strategy'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                signalJoinersByStrategy.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }
    }

    async function getSignalJoinersByUserId(id) {
        
        try {
            const subEndpoint = 'user'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                signalJoinersByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }        
    }

    // addEditSignalJoiner function edit signal_joiners
    async function addEditSignalJoiner(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching signal_joiners:', error);
            throw error;
        }
    }

    // deleteSignalJoiner function delete joiner from db
    async function deleteSignalJoiner(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting joiner:', error);
            throw error;
        }
    }

    // getSignalJoiners();

    return {
        getSignalJoiners,
        getSignalJoinersByStrategy,
        getSignalJoinersByUserId,
        signalJoiners,
        signalJoinersByStrategy,
        signalJoinersByUser,
        showEditSignalModal,
        addEditSignalJoiner,
        editSignalJoinerData,
        showDeleteConfirmationModal,
        idForDelete,
        deleteSignalJoiner,
        filteredBrokersData,

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