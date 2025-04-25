import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";
export const useNotificationsStore = defineStore('notifications', () => {
    const endpoint='notifications';
    const wait=900
    const notificationsData = ref([]);
    

    // async function getnotifications() {
    //     try {
    //         const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
    //         if (response.data){
    //             notificationsData.value = response.data;
    //         } else {
    //             let notificationsval=[
    //                 {id:1,
    //                     time:"12:20 PM",
    //                     heading:"New Order",
    //                     message:"New order alert in Matrix hunter"},
    //                     {id:2,
    //                         time:"12:20 PM",
    //                         heading:"New Order",
    //                         message:"New order alert in Matrix hunter"},
    //                         {id:3,
    //                             time:"12:20 PM",
    //                             heading:"New Order",
    //                             message:"New order alert in Matrix hunter"},
    //                             {id:4,
    //                                 time:"12:20 PM",
    //                                 heading:"New Order",
    //                                 message:"New order alert in Matrix hunter"},
    //                                 {id:5,
    //                                     time:"12:20 PM",
    //                                     heading:"New Order",
    //                                     message:"New order alert in Matrix hunter"}
    //             ]
    //             notificationsData.value=notificationsval
    //         }
              

    //     } catch (error) {
    //         let notificationsval=[
    //             {id:1,
    //                 time:"12:20 PM",
    //                 heading:"New Order",
    //                 message:"New order alert in Matrix hunter"},
    //                 {id:2,
    //                     time:"12:20 PM",
    //                     heading:"New Order",
    //                     message:"New order alert in Matrix hunter"},
    //                     {id:3,
    //                         time:"12:20 PM",
    //                         heading:"New Order",
    //                         message:"New order alert in Matrix hunter"},
    //                         {id:4,
    //                             time:"12:20 PM",
    //                             heading:"New Order",
    //                             message:"New order alert in Matrix hunter"},
    //                             {id:5,
    //                                 time:"12:20 PM",
    //                                 heading:"New Order",
    //                                 message:"New order alert in Matrix hunter"}
    //         ]
    //         notificationsData.value=notificationsval

    //         console.error('Error fetching errors:', error);
    //         throw error;
    //     }
    // }
    // getnotifications();

    return {
        endpoint,
        state,
        wait,
        notificationsData
    };
});
