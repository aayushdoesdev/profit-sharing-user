import { ref, provide, computed,watch} from 'vue';
import {getToken} from "@/requests/requests"
import {defineStore } from 'pinia'
import MatrixTicker from "@/MatrixTicker";
import { ManageWebsocketResponse } from "@/requests/manageResponse";



export const useTickerStore = defineStore('tickers', () => {
   


const wssToken = ref("");
let ticker = null;
let wsStatus = false;
var lastPrices = ref({}); 
let tickerList = ref([256265,260105,265]);

var token = computed(() => getToken());

const channel = new BroadcastChannel('my-channel');
channel.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'logout') {
    stopWebSocket()
  }
});
function updateTickerList(data) {
  for (let i = 0; i < data.length; i++) {
    if (!(data[i] in tickerList.value)) {
      tickerList.value.push(data[i]);
    }
  }
  if(token.value && ticker != null){
    const items = tickerList.value;
    ticker.subscribe(items);
    
    ticker.setMode(ticker.modeFull, items);
  }
}
  const onTicks = (ticks) => {
    let tick = JSON.parse(ticks)
    //Refresh the stores and show notification
    try{

      ManageWebsocketResponse(tick);
    }catch{
      
    }
    
    if ("Token" in tick) {
      updateLastPrice(tick);
      
    }

 
  };
          
// Function to start the WebSocket
const startWebSocket = (loggedinToken) => {
  if (!wsStatus) {
    console.log("Starting WebSocket connection");
    ticker = new MatrixTicker({
      token:loggedinToken,
    });
    ticker.connect();
    ticker.on("ticks", onTicks);
    ticker.on("connect", subscribe);
    wsStatus = true;
    
  }
};

// Function to stop the WebSocket
const stopWebSocket = () => {
  if (ticker) {
    ticker.close();
    ticker = null;
    wsStatus = false;
  }
};

// Function to handle incoming ticks
const hostname = window.location.hostname;
const isFusionDashboard = hostname.includes("fusion");

// Function to subscribe to instruments
const subscribe = () => {

  if(token.value){
    const items = tickerList.value;
    ticker.subscribe(items);
    ticker.subscribe_notification({
      "type":"update",
      "channels": isFusionDashboard ? ["updates:fusion"] : ["updates:matrix"]
  });
    ticker.setMode(ticker.modeFull, items);
  }
  
};
 

    function updateLastPrice( data) {
      var instrument_token = data.Token
        lastPrices.value[instrument_token] = data;
        return lastPrices.value
      }
    
      function getLastPrice(instrument_token) {
        if (instrument_token in lastPrices.value) {
          return lastPrices.value[instrument_token].LTP
        }
          return undefined;
      }
    
      
    
      provide('lastPriceStore', {
        updateLastPrice,
        getLastPrice,
        startWebSocket,
        stopWebSocket
      });
    
      return {
        updateLastPrice,
        getLastPrice,
        startWebSocket,
        stopWebSocket,
        updateTickerList,
        tickerList
      };

    })