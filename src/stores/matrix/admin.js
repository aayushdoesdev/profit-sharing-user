import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useAdminStore = defineStore('admin', () => {
    
    const endpoint='admin'
    const wait=0
    const admin = ref([]);

    const showAddEditModal = ref(false);
    const editAdminData = ref({});
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    
    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 


    async function getAdmin() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

            if (response.data){
                if(response.data.admins){
                    admin.value = response.data.admins.sort((a, b) => a.id - b.id);
                } else {
                    admin.value = [];
                }

                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = admin.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                admin.value = [];
            }


        } catch (error) {
            console.error('Error fetching admin:', error);
            throw error;
        }
    }


    // deleteAdmin function delete Admin from db
    async function deleteAdmin(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting Admin:', error);
            throw error;
        }
    }


    // editAdmin function edit admin
    async function editAdmin(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching admin:', error);
            throw error;
        }
    }


    // getAdmin();

    return {
        getAdmin,
        admin,
        state,
        endpoint,
        
        editAdmin, 
        showAddEditModal, 
        editAdminData,

        showDeleteConfirmationModal, 
        idForDelete,
        showMoreInfoId,
        deleteAdmin,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        totalPages,
        currentPageRecords,
    };
});