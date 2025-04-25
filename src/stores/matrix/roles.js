import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useRolesStore = defineStore('roles', () => {
    
    const endpoint='roles'
    const wait=0
    const roles = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showAddEditModal = ref(false);
    const editRoleData = ref({});

    const page_id = 1
    const page_size = 100

    async function getRoles() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                roles.value = response.data.sort((a, b) => a.id - b.id);
            } else {
                roles.value = [];
            }

        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }

    // editRole function edit roles
    async function editRole(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            throw error;
        }
    }


    getRoles();

    return {
        getRoles,
        roles,
        state,
        endpoint,
        
        editRole, 
        showAddEditModal, 
        editRoleData, 
        
        showDeleteConfirmationModal, 
        idForDelete,

    };
});