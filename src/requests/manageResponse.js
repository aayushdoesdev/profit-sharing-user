import { ref } from 'vue';
import { useUsersStore } from '@/stores/matrix/users';
import { useWebhookJoinerStore } from '@/stores/webhook/webhookStrategyJoiner';
import { useMatrixJoinerStore } from '@/stores/matrix/matrixStrategyJoiner';
import { useWebhookOrdersStore } from '@/stores/webhook/webhookOrders';
import { useMatrixOrdersStore } from '@/stores/matrix/matrixOrders';
import { useMatrixErrorsStore } from '../stores/matrix/matrixErrors';
import { useWebhookErrorsStore } from '../stores/webhook/webhookErrors';
import { useBrokerIndexStore } from '../stores/matrix/brokers';
import { useStrategyStore } from '../stores/matrix/strategies';
import { useWebhookStrategyStore } from '@/stores/webhook/webhookStrategies';
import { useWebhookPaperPositionStore } from '@/stores/webhook/webhookPaperPosition';
import { useWebhookStgPaperPositionStore } from '@/stores/webhook/webhookStgPaperPosition';

import { useStrategyTypesStore } from '../stores/matrix/strategyTypes';
import { usePlansStore } from '../stores/matrix/plans';
import { useProductCategoriesStore } from '../stores/matrix/productCategory';
import { useMatrixPlanStrategyStore } from '../stores/matrix/matrixPlanStrategies';
import { useRolesStore } from '../stores/matrix/roles';
import { useManageOrdersStore } from '../stores/matrix/manageOrders';
import { useManageStagesStore } from '../stores/matrix/manageStages';
import { useMatrixAlertsStore } from '../stores/matrix/matrixAlerts';
import { useWebhookAlertsStore } from '../stores/webhook/webhookAlerts';
import { useWebhookPositionsStore } from '../stores/webhook/webhookPositions';

// import { useMyStrategiesStore } from '@/stores/matrix/myStrategies';
import { usePositionsStore } from '@/stores/matrix/positions';
import {useInvoicesStore } from '@/stores/matrix/invoices';
import { useInvoiceItemsStore } from '@/stores/matrix/invoiceItems';
import { useGeneralOffersStore } from '@/stores/matrix/generalOffers';
import { useSpecialOffersStore } from '@/stores/matrix/specialOffers';
import { usePaperPositionStore } from '@/stores/matrix/paperPosition';
import { useMatrixPaperPositionStore } from '@/stores/matrix/matrixPaperPosition';
import { useMatrixPaperOrderStore } from '@/stores/matrix/matrixPaperOrder';
import { useMatrixDemoPaperPositionStore } from '@/stores/matrix/matrixDemoPaperPosition';
import { useAdminStore } from '@/stores/matrix/admin';
import { useSalesUserStore } from '@/stores/matrix/salesUser';
import { useVideosStore } from '@/stores/matrix/videos';
import { useSocialsStore } from '@/stores/matrix/socials';
import { useNotificationsStore } from '@/stores/matrix/notifications';
import { usePaymentQrStore } from '@/stores/matrix/paymentQr';
import { useUserAddressStore } from '@/stores/matrix/userAddress';
import { usePromoCodeStore } from '@/stores/matrix/promoCode';

import { useGroupsStore } from "@/stores/group/group"
import { useGroupJoinersStore } from '@/stores/group/groupJoiner';
import { useGroupAlertsStore } from '@/stores/group/groupAlert';
import { useGroupOrdersStore } from "@/stores/group/groupOrder"
import { useGroupMasterStore } from '@/stores/group/groupMaster'
import { useManualPositionsStore } from '@/stores/group/manualPositions'


import { useSignalJoinerStore } from '@/stores/signal/joiner'
import { useSignalOrdersStore } from '@/stores/signal/order'
import { useSignalPositionsStore } from '@/stores/signal/position'
import { useSignalStore } from '@/stores/signal/signal'

import { useIndicatorsStore } from '@/stores/indicator/indicator'

import { useSubscriptionsStore  } from '@/stores/matrix/subscriptions'
import { useScreenersStore } from '@/stores/matrix/screener'
import { useMatrixSummaryStore } from '@/stores/summary/matrix'

import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import { canMakeRequest }  from '@/requests/requests';

let messageType=ref('');

const messageName={
    users: 'user',
    webhookStrategyJoiner: 'webhook_strategy_joiner',
    matrixStrategyJoiner: 'matrix_strategy_joiner',
    webhookOrders:'webhook_orders',
    matrixOrders:'matrix_orders',
    matrixErrors:'matrix_errors',
    webhookErrors:'webhook_errors',
    brokers: 'broker',
    generateToken: 'token',
    strategies: 'strategy',
    webhookStrategies: 'webhook strategy',
    webhookPaperPositions: 'webhook_paper_position',
    strategyPaperPosition: 'webhook_stg_paper_position',
    paperPosition:'paper_position',
    matrixPaperPosition: 'matrix_stg_paper_position',
    matrixPaperOrder: 'matrix_paper_order',
    matrixDemoPaperPosition: 'matrix_demo_stg_paper_position',
    myStrategies: 'Webhook_strategy',
    strategyType: 'strategy',
    // orders: 'order',
    // mystrategies: 'strategy',
    positions: 'position',
    invoices: 'invoice',
    invoiceItems: 'invoice_item',
    generalOffers: 'generalOffer',
    specialOffers: 'specialOffer',
    // webhook_strategies: 'webhook strategy',
    admin: 'admin',
    salesUser: 'salesUser',
    plans: 'plans',
    productCategories: 'productCategory',
    matrixPlanStrategy: 'matrix_plan_strategy',
    roles: 'roles',
    manageOrders: 'manage_order',
    manageStages: 'manage_stage',
    matrixAlerts: 'matrix_alert',
    webhookAlerts: 'webhook_alert',
    webhookPositions: 'webhook_position',
    videos: 'videos',
    socials: 'social',
    paymentQr: 'PaymentQR',
    userAddresses: 'user_address',
    promoCode: 'promo_code',

    groups: 'group',
    groupJoiners: 'group_joiner',
    groupAlerts: 'group_alert',
    groupMaster: 'group_master',
    groupOrders: 'group_order',
    manualPositions: 'manual_position',


    signalJoiner: 'signal_joiner',
    signalOrders: 'signal_order',
    signalPositions: 'signal_position',
    signal: 'signal',

    indicators: 'indicator',

    subscriptions: 'subscriptions',
    screeners: 'screeners',
    matrixSummary: 'matrix_summary',
}

const statusMessages = {
    200: 'Success: ',
    201: 'Created: ',
    400: 'Bad Request: ',
    401: 'Unauthorized: ',
    403: 'Forbidden: ',
    404: 'Not Found: ',
    500: 'Internal Server Error: ',
    502: 'Bad Gateway: ',
    503: 'Service Unavailable: ',
    504: 'Gateway Timeout: ',
};

const getMethods=ref({
    users: 'getUsers',
    webhookStrategyJoiner: 'getWebhookJoiners',
    matrixStrategyJoiner: 'getMatrixJoiners',
    matrixOrders: 'getMatrixOrders',
    webhookOrders: 'getWebhookOrders', 
    matrixErrors: 'getMatrixErrors',
    webhookErrors: 'getWebhookErrors',
    brokers: 'getBrokers',
    strategies: 'getStrategies',
    webhookStrategies: 'getWebhookStrategies',
    webhookPaperPositions: 'getPaperPositions',
    strategyPaperPosition: 'getWebhookPaperPositions',
    myStrategies:'getMyStrategies',
    strategyType: 'getStrategyTypes',
    paperPosition:'getPaperPositions',
    matrixPaperPosition:'getMatrixPaperPositions',  
    matrixPaperOrder:'getMatrixPaperOrders',
    matrixDemoPaperPosition:'getMatrixDemoPaperPositions',
    // orders: 'getOrders',
    // mystrategies: 'getMyStrategies',
    positions: 'getPositions',
    invoices: 'getInvoices',
    invoiceItems: 'getInvoiceItems',
    generalOffers: 'getGeneralOffers',
    specialOffers: 'getSpecialOffers',
    // webhook_strategies: 'getWebhookStrategies',
    admin: 'getAdmin',
    salesUser: 'getSalesUser',
    plans: 'getPlans',
    productCategories: 'getCategories',
    matrixPlanStrategy: 'getMatrixPlanStrategy',
    roles: 'getRoles',
    manageOrders: 'getManageOrders',
    manageStages: 'getManageStages',
    matrixAlerts: 'getMatrixAlerts',
    webhookAlerts: 'getWebhookAlerts',
    webhookPositions: 'getWebhookPositions',
    videos: 'getVideos',
    socials: 'getSocials',
    paymentQr: 'getPaymentQr',
    userAddresses: 'getUserAddress',
    promoCode: 'getPromoCode',

    manualGroup: 'getGroups',
    groupJoiners: 'getGroupJoinersByGroupId',
    groupAlerts: 'getGroupAlerts',
    groupMaster: 'getGroupMaster',
    groupOrders: 'getGroupOrders',
    manualPositions: 'getManualPositions',

    signalJoiner: 'getSignalJoiners',
    signalOrders: 'getSignalOrders',
    signalPositions: 'getSignalPositions',
    signal: 'getSignals',

    indicators: 'getIndicators',

    subscriptions: 'getSubscriptions',
    screeners: 'getScreeners',
    matrixSummary: 'getMatrixSummary',

})

function showToast(message, success = true) {
    const toastNode = dom(success ? "#success-notification-content" : "#failed-notification-content")
        .clone()
        .removeClass("hidden")[0];
    // Modify the content of the cloned node with the custom message
    toastNode.querySelector('.notification-text').innerText = message;

    Toastify({
        node: toastNode,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
    }).showToast();
}

const storeFunctions = {
    users: useUsersStore,
    webhookStrategyJoiner: useWebhookJoinerStore,
    matrixStrategyJoiner: useMatrixJoinerStore,
    webhookOrders: useWebhookOrdersStore,
    matrixOrders: useMatrixOrdersStore,
    matrixErrors: useMatrixErrorsStore,
    webhookErrors: useWebhookErrorsStore,
    brokers: useBrokerIndexStore,
    strategies: useStrategyStore,
    webhookStrategies: useWebhookStrategyStore,
    webhookPaperPositions: useWebhookPaperPositionStore,
    strategyPaperPosition: useWebhookStgPaperPositionStore,
    strategyType: useStrategyTypesStore,
    positions: usePositionsStore,
    invoices: useInvoicesStore,
    invoiceItems: useInvoiceItemsStore,
    generalOffers: useGeneralOffersStore,
    specialOffers: useSpecialOffersStore,
    paperPosition:usePaperPositionStore,
    matrixPaperPosition:useMatrixPaperPositionStore,
    matrixPaperOrder:useMatrixPaperOrderStore,
    matrixDemoPaperPosition:useMatrixDemoPaperPositionStore,
    // webhook_strategies: useWebhookStrategiesStore,
    admin: useAdminStore,
    salesUser: useSalesUserStore,   
    plans: usePlansStore,
    productCategories: useProductCategoriesStore,
    matrixPlanStrategy: useMatrixPlanStrategyStore,
    roles: useRolesStore,
    manageOrders: useManageOrdersStore,
    manageStages: useManageStagesStore,
    matrixAlerts: useMatrixAlertsStore,
    webhookAlerts: useWebhookAlertsStore,
    webhookPositions: useWebhookPositionsStore,
    videos: useVideosStore,
    socials: useSocialsStore,
    notifications: useNotificationsStore,
    paymentQr: usePaymentQrStore,
    userAddresses: useUserAddressStore,
    promoCode: usePromoCodeStore,

    manualGroup: useGroupsStore,
    groupJoiners: useGroupJoinersStore,
    groupAlerts: useGroupAlertsStore,
    groupMaster: useGroupMasterStore,
    groupOrders: useGroupOrdersStore,
    manualPositions: useManualPositionsStore,

    signalJoiner: useSignalJoinerStore,
    signalOrders: useSignalOrdersStore,
    signalPositions: useSignalPositionsStore,
    signal: useSignalStore,

    indicators: useIndicatorsStore,

    subscriptions: useSubscriptionsStore,
    screeners: useScreenersStore,
    matrixSummary: useMatrixSummaryStore,

};

function ManageApiResponse(response, endpoint,method) {
    if(endpoint === 'positionCSVData'){
        showToast("No data to download", false);
        return
    }
    try {
        // if(endpoint!=='profile' && endpoint !=="videos"){
        if(endpoint!=='profile'){
            // if(response.status===200){
            //     if (endpoint==='generateToken'){
            //         statusMessages[response.status]="Success: "+response.data.message
            //     }else if(method==='DELETE'){
            //         let name = messageName[endpoint]
                
            //         statusMessages[response.status]="Success: "+name+' deleted successfully'
            //     }else{
            //         let name = messageName[endpoint]
                
            //         statusMessages[response.status]="Success: "+name+' updated successfully'
            //     }
                
            // }else if(response.status===201){
            //     let name = messageName[endpoint]
    
            //     statusMessages[response.status]="Success: "+name+' created successfully'
            // }
    
          

                const message = statusMessages[response.status] + response.data.message || 'Unknown status code';
                if(response.status == 401 && canMakeRequest.value==false){
                    
                } else {
                    showToast(message, response.status >= 200 && response.status < 300);
                }
                
                if(endpoint ==='generateToken'){
                    endpoint ='brokers'
                } else if ( endpoint ==='strtgposSqOff')  {
                    endpoint ='strategies'
                }
                
                if ((response.status >= 200 && response.status < 300 ) && endpoint !=='strtgposSqOff')  {

                    const storeFunction = storeFunctions[endpoint];
                    if (typeof storeFunction === 'function') {
                        storeFunction()[getMethods.value[endpoint]]();
                    } else {
                        console.error('Store function not found for endpoint:', endpoint);
                    }
                }
        } else {
            showToast(response.data.message, response.status >= 200 && response.status < 300);
        }
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}




function ManageWebsocketResponse(response) {
    
    if (response.type) {
        try {
            const excludedTypes = ["brokers", "webhookStrategies", "webhookStrategyJoiners", "updateUser", "mystrategies", "invoice", "strategies", "social", "videos"];

            if (!excludedTypes.includes(response.type)) {
                let formattedTime=''
                if (response.method ==='POST'){
                    formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.data.created_at));
                }else if (response.method ==='PUT'){
                    formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.data.updated_at));
                }
                let side =''
                if(response.type ==='orders' || response.type === 'webhookOrders'){
                    side=response.data.data.transaction_type
                    try{
                        playAudio('order');
                    }catch{
                        console.error('Error playing audio:', error);
                    }
                }else if(response.type ==='positions' || response.type === 'webhookPositions'){
                    side=response.data.data.side
                    try{
                        playAudio('order');
                    }catch{
                        console.error('Error playing audio:', error);
                    }
                }

                let strategyId =''
                if(response.type === 'webhookOrders' || response.type === 'webhookPositions'){
                    strategyId=response.data.data.webhook_strategy_id
                }else{
                    strategyId=response.data.data.strategy_id
                }

                const notificationsStore = storeFunctions.notifications();
                notificationsStore.notificationsData.push({
                    id: response.data.id,
                    strategy_id: strategyId,
                    status: response.data.data.status,
                    heading: response.type,
                    exchange: response.data.data.exchange,
                    tradingsymbol: response.data.data.tradingsymbol,
                    side: side,
                    time: formattedTime,
                    message: response.data.description
                });

            
                let message = 'Success: '+response.data.description;
                showToast(message, true);
            }
            
            const storeFunction = storeFunctions[response.type];
            if (typeof storeFunction === 'function') {
                if (response.type ==='positions'){
                    const storeFunctiontemp = storeFunctions['mystrategies'];
                    storeFunctiontemp()[getMethods.value['mystrategies']]();
                }else if(response.type ==='orders'){
                    const storeFunctiontempPapPo = storeFunctions['positionsPaper'];
                    storeFunctiontempPapPo()[getMethods.value['positionsPaper']]();
                }else if(response.type ==='webhookPositions'){
                    const storeFunctiontemp = storeFunctions['webhookStrategies'];
                    storeFunctiontemp()[getMethods.value['webhookStrategies']]();
                }else if(response.type ==='webhookOrders'){
                    const storeFunctiontemp = storeFunctions['webhookAlerts'];
                    storeFunctiontemp()[getMethods.value['webhookAlerts']]();
                    
                    const storeFunctiontempWb = storeFunctions['webhookStrategies'];
                    storeFunctiontempWb()[getMethods.value['webhookStrategies']]();
                }

                if(response.type === 'orders' || response.type === 'positions' || response.type === 'users' || response.type === 'myStrategies'){
                    const storeFunctionSummary = storeFunctions['matrixSummary'];
                    storeFunctionSummary()[getMethods.value['matrixSummary']]();
                }
                
                storeFunction()[getMethods.value[response.type]]();
            } else {
                console.error('Store function not found for response.type:', response.type);
            }

        } catch (error) {
            console.error('Error in websocket manage:', error);
            throw error;
        }
    }
}



export { ManageApiResponse, ManageWebsocketResponse };