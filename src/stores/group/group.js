import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useGroupsStore = defineStore('groups', () => {
    
    const endpoint='manualGroup'
    const wait=0
    const groupsList = ref([]);
    let showAddEditModal = ref(false);
    const editGroupsData= ref({})
    const showDeleteConfirmationModal = ref(false);
    const idForDelete = ref(0);
    const showMoreInfoId = ref(0);

    const showJoinersModal = ref(false)
    const showPaperPositionModal    = ref(false)

    let page_id = 1;
    let page_size = 10;
    let search = '';

    
    async function getGroups(refresh=false) {
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
                // const modifiedStrategies = response.data.map((strategie) => {
                //     const newStrategie = { ...strategie };
                //     newStrategie.color2 = strategie.color.replace(/,[\s\d.]+[)]$/, ", 0.1)");
                //     return newStrategie;
                //   });
                  
                groupsList.value = response.data?.strategies || [];//.sort((a, b) => b.id - a.id);

            }else{
                groupsList.value = [];
            }

        } catch (error) {
            console.error('Error fetching groups:', error);
            throw error;
        }
    }


    async function deleteGroup(id) {
        try {
            idForDelete.value=0;
            await makeRequest(endpoint, "DELETE",{}, {}, {},wait,id);
    
        } catch (error) {
            console.error('Error deleteting group:', error);
            throw error;
        }
    }


    async function addEditGroup(id, formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},wait,id);                
            }else {
                await makeRequest(endpoint, "POST",formdata, {}, {},wait,null);
            }
        } catch (error) {
            console.error('Error editing group:', error);
            throw error;
        }
    }

    getGroups()
    return {
        getGroups,
        groupsList,
        deleteGroup,
        showAddEditModal,
        addEditGroup,
        editGroupsData,
        showJoinersModal,
        showPaperPositionModal,
        endpoint,
        state,
        showDeleteConfirmationModal,
        idForDelete,
        showMoreInfoId
    };
});