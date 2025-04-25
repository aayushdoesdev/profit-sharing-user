import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile' , () => {

    const endpoint = 'profile';
    const profile = ref({});

    
    const getProfile = async () => {
        try {
            const response = await makeRequest(endpoint , 'GET' );
            if(response.data)
            {
                profile.value = response.data.profile;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }

    }

    getProfile();
    return {
        profile,
        getProfile
    }

})