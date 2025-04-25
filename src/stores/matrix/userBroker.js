import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";



export const useUserBrokersStore = defineStore('userBrokers', () => {
    
    const endpoint='userBrokers'
    const fetchedUserBrokers = ref([]);
    const searchUser  = ref('');

    async function getUserBrokers() {
        if(searchUser.value.length < 1 || searchUser.value === "Select User/Broker") return;
        try {
            const response = await makeRequest("userBrokers", "GET", {}, {}, {page_id: 1, page_size: 20, search:searchUser.value}, 0);

            let temp = response.data || [];
            fetchedUserBrokers.value =  [];
            let temp2 = []
            
            temp.forEach(data => {
                if(!data) return;
                const option = {
                    id: `${data.id}-${data.broker_id}`,
                    user_id: data.id,
                    broker_id: data.broker_id,
                    user: `${data.id}-${data.name}`,
                    broker: `${data.broker_id}- ${data.broker_name}${data.broker_userid}`,
                    broker_name: data.broker_name,
                    label: `${data.id}. ${data.name} - ${data.broker_name}${data.broker_userid}`
                }
                temp2.push(option);
            });

            fetchedUserBrokers.value = temp2;

            // temp.forEach(user => {
            //     user.brokers.forEach(broker => {
            //         if(!broker) return;
            //     const option = {
            //         id: `${user.id}-${broker.id}`,
            //         user_id: user.id,
            //         broker_id: broker.id,
            //         user: `${user.id}-${user.name}`,
            //         broker: `${broker.id}- ${broker.broker_name}${broker.broker_userid}`,
            //         broker_name: broker.broker_name,
            //         label: `${user.id}-${user.name} - ${broker.id}- ${broker.broker_name}${broker.broker_userid}`
            //     };
            //     temp2.push(option);
            //     });
            // });
            // fetchedUserBrokers.value = temp2;

        } catch (error) {
            
        }
    }


    getUserBrokers();

    return {
        getUserBrokers,
        fetchedUserBrokers,
        searchUser,
        state,
        endpoint,

    };
});