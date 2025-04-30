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
                profile.value = response.data;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }

    }

    const updateProfile = async(data) => {
        try {
            const response = await makeRequest(endpoint, "PUT", data)
            
        } catch (error) {
            console.log("This is from profile", error)
        }
    }

    const changePassword = async(data) => {
        try {
            const response = await makeRequest(endpoint, "PUT", data)
            
        } catch (error) {
            console.log("This is from profile", error)
        }
    }

    getProfile();
    return {
        profile,
        getProfile,
        updateProfile,
        changePassword
    }

})