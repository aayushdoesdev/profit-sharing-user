import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSpecialOffersStore = defineStore('specialOffers', () => {
    
    const endpoint='specialOffers'
    const wait=0
    const specialOffers = ref([]);
    let showEditSpecialOffersModal = ref(false);
    const editSpecialOfferData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    const searchInputText = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);

    async function getSpecialOffers() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100// selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                specialOffers.value = response.data;
            } else {
                specialOffers.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix orders:', error);
            throw error;
        }
    }


    // addEditSpecialOffer function edit specialOffers
    async function addEditSpecialOffer(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching matrix_orders:', error);
            throw error;
        }
    }

    // deleteSpecialOffers function delete specialOffers from db
    async function deleteSpecialOffers(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting specialOffer:', error);
            throw error;
        }
    }

    getSpecialOffers();

    return {
        getSpecialOffers,
        specialOffers,
        showEditSpecialOffersModal,
        addEditSpecialOffer,
        editSpecialOfferData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        deleteSpecialOffers,
        
    };
});
