import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const usePromoCodeStore = defineStore('promoCode', () => {
    
    const endpoint='promoCode'
    const wait=0
    const offerByUserId = ref({});
    const promoError  = ref(null);


    async function getPromoCode() {

    }

    async function getOfferByPromoCode(data) {
        try {
            const response = await makeRequest("promoCode", "POST", data, {}, {}, 0);
            if (response.data){
                offerByUserId.value = response.data;
            } else {
                promoError.value = "Invalid Promo Code!";
                offerByUserId.value = {};
            }
        } catch (error) {
            promoError.value = "Invalid Promo Code!";
            console.error('Error fetching promoCode:', error);
            throw error;
        }
    }


    return {
        getPromoCode,
        getOfferByPromoCode,
        offerByUserId,
        promoError,
        state,
        endpoint,
    };
});