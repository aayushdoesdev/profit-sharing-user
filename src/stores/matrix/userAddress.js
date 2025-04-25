import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useUserAddressStore = defineStore('userAddress', () => {
    
    const endpoint='userAddress'
    const wait=0
    const userAddress = ref([]);
    const userAddressByUserId = ref({});

    const showAddEditModal = ref(false);
    const addEditUserAddressData = ref({});
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    

    async function getUserAddress() {
        // try {
        //     var page_id = currentPageNumber.value
        //     var page_size = 100
        //     var search = searchInputText.value

        //     const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);

        //     if (response.data){
        //         if(response.data.userAddress){
        //             userAddress.value = response.data.userAddress;
        //         } else {
        //             userAddress.value = [];
        //         }
        //     } else {
        //         userAddress.value = [];
        //     }


        // } catch (error) {
        //     console.error('Error fetching userAddress:', error);
        //     throw error;
        // }
    }

    async function getUserAddressByUserId(id) {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {user_id:id},wait);
            if (response.data){
                userAddressByUserId.value = response.data;
            } else {
                userAddressByUserId.value = {};
            }
        } catch (error) {
            console.error('Error fetching userAddress:', error);
            throw error;
        }
    }


    // deleteUserAddress function delete UserAddress from db
    async function deleteUserAddress(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting userAddress:', error);
            throw error;
        }
    }


    // addEditUserAddress function edit userAddress
    async function addEditUserAddress(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching userAddress:', error);
            throw error;
        }
    }


    getUserAddress();

    return {
        getUserAddress,
        getUserAddressByUserId,
        userAddress,
        userAddressByUserId,
        state,
        endpoint,
        
        addEditUserAddress, 
        showAddEditModal, 
        addEditUserAddressData,

        showDeleteConfirmationModal, 
        idForDelete,
        deleteUserAddress,
    };
});