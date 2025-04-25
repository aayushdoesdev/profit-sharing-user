import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useProductCategoriesStore = defineStore('categories', () => {
    // categories named as product in backend
    const endpoint='productCategories'
    const wait=0
    const categories = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const showMoreInfoId = ref(0);
    const showAddEditModal = ref(false);
    const editCategoryData = ref({});

    async function getCategories() {
        try {

            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if (response.data){
                categories.value = response.data//.sort((a, b) => a.id - b.id);                
            } else {
                categories.value = []
            }

        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // deleteCategory function delete Category from db
    async function deleteCategory(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting product:', error);
            throw error;
        }
    }


    // editCategory function edit Category
    async function editCategory(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    const isFusionDashboard = computed(() => {
        return window.location.href.includes('fusionxtech') || false
    })


    getCategories();

    return {
        getCategories,
        categories,
        state,
        endpoint,
        
        editCategory, 
        showAddEditModal, 
        editCategoryData, 
        
        showDeleteConfirmationModal, 
        idForDelete,
        showMoreInfoId,
        deleteCategory,
        isFusionDashboard
    };
});