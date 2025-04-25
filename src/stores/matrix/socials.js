import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useSocialsStore = defineStore('socials', () => {
    
    const endpoint='socials'
    const wait=0
    const socials = ref([]);
    const socialsByUser = ref([]);
    const socialsUser = ref({"userName":"","id":""});
    let showEditSocialsModal = ref(false);
    const editSocialData= ref({});

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);


    async function getSocials() {

    }

    async function getSocialsByUser(id) {
        try {
            
            const subEndpoint = 'api'
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait,id);
            if (response.data){
                let data = response.data

                if(Array.isArray(data) && data.length > 0) {
                    socialsByUser.value = data;
                } else if(typeof data === 'object' && data !== null && Object.keys(data).length > 0) {
                    socialsByUser.value = [];
                    socialsByUser.value.push(data);
                } else {
                    socialsByUser.value = [];
                }
            } else {
                socialsByUser.value = [];
            }

        } catch (error) {
            console.error('Error fetching socials:', error);
            throw error;
        }
    }

    let data = {}
    console.log("print Arra :", Array.isArray(data), typeof data, data, Object.keys(data).length);

    // addEditSocial function edit socials
    async function addEditSocial(id,formdata) {
        try {
            if (id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            } else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching socials:', error);
            throw error;
        }
    }

    // deleteSocials function delete social from db
    async function deleteSocials(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting social:', error);
            throw error;
        }
    }

    return {
        getSocials,
        getSocialsByUser,
        socials,
        socialsByUser,
        showEditSocialsModal,
        addEditSocial,
        editSocialData,
        endpoint,
        state,

        showDeleteConfirmationModal,
        idForDelete,
        deleteSocials,
        socialsUser,
        
    };
});
