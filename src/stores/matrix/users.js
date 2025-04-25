import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";
import { useBrokerIndexStore } from './brokers';



export const useUsersStore = defineStore('users', () => {

    const brokerIndexStore = useBrokerIndexStore();
    const { brokers } = storeToRefs(brokerIndexStore);
    const userBrokerData = ref([]);
    
    const endpoint='users'
    const wait=0
    const users = ref([]);
    const usersById = ref([]);
    const userData  = ref(null)
    let requested = ref([]);
    const ignoreId = ref([]);

    const showAddEditModal = ref(false);
    const editUserData = ref({});

    const showKycModal = ref(false)
    const showMoreInfoId = ref(0);

    const showBrokerModal = ref(false);
    const brokersUserId = ref(0);

    const showJoinersModal = ref(false);
    const showJoinersPageModal = ref(false);
    const joinersUserId = ref(0);
    const positionsUserId  = ref(0);

    const showMatrixJoinersModal = ref(false);
    const showWebhookJoinersModal = ref(false);

    const searchBySubscription = ref('')



    const showOrdersModal = ref(false); // To Open Optional Orders Modal
    const showWebhookOrdersModal = ref(false); // To Open Webhook Orders Modal
    const showMatrixOrdersModal = ref(false); // To Open Matrix Orders Modal
    const ordersUserId = ref(0);

    const showErrorsModal = ref(false);
    const showWebhookErrorsModal = ref(false);
    const showMatrixErrorsModal = ref(false);
    const errorsUserId = ref(0);

    const showPositionsModal = ref(false);

    const showSocialsModal = ref(false);
    const showSubscriptionModal = ref(false);

    const searchInputText = ref('');
    const pageSizeOption = ref('');
    const selectPageOptions = ref([10, 20, 30, 40, 500]);
    const currentPageNumber = ref(1);
    const pageSize = ref(100);
    const totalPages = ref(0);
    const showStartRecords = ref(1);
    const showEndRecords = ref(0);
    const totalRecords = ref(1);
    const currentPageRecords = ref(0); 


    async function getUsers() {
        try {
            if(searchInputText.value === "Select User") return;
            var page_id = currentPageNumber.value
            var page_size = pageSize.value//selectPageOptions.value[0]
            var search = searchInputText.value
            var kyc_status = searchBySubscription.value
            const response = await makeRequest(endpoint, "GET",{}, {}, {page_id, page_size, search, kyc_status},wait);

            if (response.data){
                if(response.data.users){
                    users.value = response.data.users;
                } else {
                    users.value = [];
                }
                totalRecords.value = response.data.count;
                showStartRecords.value = 1 + (currentPageNumber.value-1) * page_size
                showEndRecords.value = users.value.length + (currentPageNumber.value-1) * page_size
                if(totalRecords.value % page_size == 0){
                    totalPages.value = totalRecords.value / page_size 
                } else {
                    totalPages.value = Math.floor(totalRecords.value / page_size) + 1
                }
            } else {
                users.value = [];
            }

        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
    let temp = []


    // const computeUserBrokers = (brokers) => {
    //     userBrokerData.value = [];
    //     brokers.forEach(broker => {
    //         const option = {
    //         id: `${broker.user_id}-${broker.id}`,
    //         user_id: broker.user_id,
    //         broker_id: broker.id,
    //         user: `${broker.user_id}-${broker.user_name}`,
    //         broker: `${broker.id}- ${broker.broker_name}${broker.broker_userid}`,
    //         broker_name: broker.broker_name,
    //         label: `${broker.user_id}-${broker.user_name} - ${broker.id}- ${broker.broker_name}${broker.broker_userid}`
    //         };
    //         temp.push(option);
    //     });
    //     userBrokerData.value = temp;
    // }

    // watchEffect(() => {
    //     if(brokers.value.length > 0) {
    //         temp = []
    //         computeUserBrokers(brokers.value);
    //     }
    // })

    // const computeUserBrokers = (users) => {
    //     userBrokerData.value = [];
    //     users.forEach(user => {
    //         brokers.value.forEach(broker => {
    //           const option = {
    //             id: `${user.id}-${broker.id}`,
    //             user_id: user.id,
    //             broker_id: broker.id,
    //             user: `${user.id}-${user.name}`,
    //             broker: `${broker.id}- ${broker.broker_name}${broker.broker_userid}`,
    //             broker_name: broker.broker_name,
    //             label: `${user.id}-${user.name} - ${broker.id}- ${broker.broker_name}${broker.broker_userid}`
    //           };
    //           temp.push(option);
    //         });
    //     });
    //     userBrokerData.value = temp;
    // }

    // get users by id function
    async function getUsersById(id) {
        if(!requested.value.includes(id) && ignoreId.value.includes(id)) {
            requested.value.push(id);
            try {
                const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait, id);
                if (response.data) {
                    const userExists = users.value.some(user => user.id === id);
                    if (!userExists) {
                        users.value.push(response.data);
                        ignoreId.value.push(id);
                    }
                } else if(response.data == null) {
                    ignoreId.value.push(id);
                }
            } catch (error) {
                ignoreId.value.push(id);
                throw error;
            } finally {
                requested.value.pop(); // Cleanup logic
            }
        } else {
            if(!requested.value.includes(id)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // editUser function edit user
    async function editUser(id,formdata) {
        try {
            if (id){
                await makeRequest(endpoint, "PUT",formdata, {}, {},0,id);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }


    getUsers();

    return {
        getUsers,
        getUsersById,
        users,
        userBrokerData,
        usersById,
        userData,
        state,
        endpoint,
        
        editUser, 
        showAddEditModal, 
        editUserData, 

        showKycModal,
        showMoreInfoId,

        showBrokerModal,
        brokersUserId,
        positionsUserId,
        

        showJoinersModal,
        showJoinersPageModal,
        showMatrixJoinersModal,
        showWebhookJoinersModal,
        joinersUserId,

        showOrdersModal,
        showWebhookOrdersModal,
        showMatrixOrdersModal,
        ordersUserId,

        showErrorsModal,
        showWebhookErrorsModal,
        showMatrixErrorsModal,
        errorsUserId,

        showPositionsModal,
        showSocialsModal,
        showSubscriptionModal,

        searchInputText,
        showStartRecords,
        showEndRecords,
        totalRecords,
        currentPageNumber,
        pageSize,
        totalPages,
        currentPageRecords,
        searchBySubscription
    };
});