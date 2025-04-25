import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useMatrixErrorsStore = defineStore('matrix_errors', () => {
    
    const endpoint='matrixErrors'
    const wait=0
    const matrixErrors = ref([]);
    const matrixErrorsByUser = ref([]);
    let showEditMatrixModal = ref(false);
    const editMatrixErrorData= ref({});

    const page_id=1
    const page_size=100


    async function getMatrixErrors() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait);
            if (response.data){
                matrixErrors.value = response.data;
            } else {
                matrixErrors.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix errors:', error);
            throw error;
        }
    }

    async function getMatrixErrorsByUser(id) {
        try {
            const subEndpoint = 'user'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait, id, subEndpoint);
            if (response.data){
                matrixErrorsByUser.value = response.data;
            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    // addEditMatrixError function edit matrix_errors
    async function addEditMatrixError(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrix_errors:', error);
            throw error;
        }
    }

    // getMatrixErrors();

    return {
        getMatrixErrors,
        getMatrixErrorsByUser,
        matrixErrors,
        matrixErrorsByUser,
        showEditMatrixModal,
        addEditMatrixError,
        editMatrixErrorData,
        endpoint,
        state,
    };
});
