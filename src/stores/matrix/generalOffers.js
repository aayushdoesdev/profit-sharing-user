import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useGeneralOffersStore = defineStore('generalOffers', () => {
    
    const endpoint='generalOffers'
    const wait=0
    const generalOffers = ref([]);
    let showEditGeneralOffersModal = ref(false);
    const editGeneralOfferData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    const searchInputText = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);

    async function getGeneralOffers() {
        try {
            var page_id = currentPageNumber.value
            var page_size = 100//selectPageOptions.value[0]
            var search = searchInputText.value

            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search},wait);
            if (response.data){
                generalOffers.value = response.data.sort((a, b) => a.id - b.id);
            } else {
                generalOffers.value = [];
            }

        } catch (error) {
            console.error('Error fetching matrix orders:', error);
            throw error;
        }
    }


    // addEditGeneralOffer function edit generalOffers
    async function addEditGeneralOffer(id,formdata) {
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

    // deleteGeneralOffers function delete generalOffers from db
    async function deleteGeneralOffers(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting generalOffer:', error);
            throw error;
        }
    }

    getGeneralOffers();

    return {
        getGeneralOffers,
        generalOffers,
        showEditGeneralOffersModal,
        addEditGeneralOffer,
        editGeneralOfferData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        deleteGeneralOffers,

    };
});
