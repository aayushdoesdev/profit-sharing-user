import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";


export const useVideosStore = defineStore('videos', () => {
    const endpoint='videos'
    const wait=1000

    const videos = ref([]);

    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref({});
    const showAddEditModal = ref(false);
    const addEditVideosData = ref({});

    const page_id=1
    const page_size=100

    async function getVideos() {
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size},wait)
            if (response.data){
                videos.value = response.data;
            } else {
                videos.value = [];
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    // addEditVideos function edit Videos
    async function addEditVideos(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }else {
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching Videos:', error);
            throw error;
        }
    }

    // deleteVideo function delete Videos from db
    async function deleteVideo(id) {
        try {
            await makeRequest(endpoint, "DELETE",{}, {}, {},0,id);
        } catch (error) {
            console.error('Error deleteting Video:', error);
            throw error;
        }
    }

    
    getVideos()
    return {
        getVideos,
        videos,
        endpoint,
        state,

        addEditVideos,
        deleteVideo,
        showDeleteConfirmationModal,
        idForDelete,
        showAddEditModal,
        addEditVideosData,

    };
});
