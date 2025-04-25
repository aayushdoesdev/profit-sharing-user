import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const usePaymentQrStore = defineStore('paymentQr', () => {
    
    const endpoint='paymentQr'
    const wait=0
    const paymentQr = ref([]);

    const showAddEditModal = ref(false);
    const addEditPaymentQrData = ref({});

    async function getPaymentQr() {

    }

    // editPaymentQr function edit paymentQr
    async function addEditPaymentQr(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
            else {
                await makeRequest(endpoint, "POST",formdata, {}, {},0,null);
            }
        } catch (error) {
            console.error('Error fetching paymentQr:', error);
            throw error;
        }
    }


    getPaymentQr();

    return {
        getPaymentQr,
        paymentQr,
        state,
        endpoint,
        
        addEditPaymentQr, 
        showAddEditModal, 
        addEditPaymentQrData,
    };
});