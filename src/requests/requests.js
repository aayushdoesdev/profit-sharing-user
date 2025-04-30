import { ref, toRefs,reactive , computed} from 'vue';
import  router  from "@/router/index";
// import { ManageApiResponse } from "./manageResponse";
import config from '../../matrixcnfg.js';


const token = ref(null);
const isAuthenticated = ref(null)



token.value = localStorage.getItem('token');
if ( token.value ) {
  try{
    isAuthenticated.value=true
  }catch (error){
    isAuthenticated.value=false
  }

}


const setisAuthenticated = (value) => {
  isAuthenticated.value = value;
};
const getisAuthenticated = () => {
  return isAuthenticated.value 
};


const setToken = (tokendata) => {
    token.value = tokendata;
  };
  const getToken = () => {

    return token.value ;
  };




  const channel = new BroadcastChannel('my-channel');
  channel.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'logout') {
      logout()
    }
  });
const canMakeRequest = ref(true);
const logout = async () => {
  canMakeRequest.value = false;
  await makeRequest("logout", "GET", {}, {}, {},0,null);
  if (localStorage.getItem('token')!=""){
    channel.postMessage({ type: 'logout', data: 'logged out' });
  }

  setToken(null);
  localStorage.setItem('token', "");
  router.push({ name: 'login' });
  window.location.reload();
};


import axios from 'axios';
axios.defaults.silent = true;
axios.defaults.withCredentials = true;


let baseUrl
if(config.env=="production"){
  const currentRootUrl = window.location.origin;
  baseUrl= ref(currentRootUrl);
}else{
  baseUrl= ref("https://w3ncd4pn-5000.inc1.devtunnels.ms");
}


const endpoints = ref({
  login: '/admin/user/login',
  logout: '/admin/logout',
  register: '/admin/user/signup',
  verifyOTP: '/auth/forgot-password',
  sendForgotOTP: '/auth/send-email/forgot-password/otp',
  forgot: '/auth/forgot-password',
  profile: '/admin/users/profile',
  positions : '/admin/positions'
  
})

const getApiUrl = (endpoint) => {
  return `${baseUrl.value}${endpoints.value[endpoint]}`;
};

const state = reactive({});

// Function to create the state properties for an endpoint
function createStateForEndpoint(endpoint) {
  if(!state[endpoint]){
    state[endpoint] = {
      loading: true,
      data: null,
      error: {},
      updating:false
    }
  }else{
    state[endpoint].updating=true
  };
}


const makeApiRequest = async (config,wait,endpoint,id) => {
  if (isAuthenticated.value) {
    config.headers = {
      ...config.headers,
      Authorization: token.value,
    };
  }else if(endpoint!="login" && endpoint!="register" && endpoint!="verifyOTP"){
    router.push({ name: 'login' });
  }
  await sleep(wait)
  try {
    const response = await axios(config);
    
    state[endpoint].error = null;   
    if (response.status === 200 && (endpoint === 'login' || endpoint === 'logout' || endpoint === 'register' || endpoint === 'verifyOTP' || endpoint === 'sendForgotOTP' || endpoint === 'forgot' || (config.method === 'GET' && !id && endpoint !== 'generateToken'))) {
      return response.data;
    } else if (response.headers['content-type'] === 'text/csv' || response.headers['content-type'] === 'application/csv') {
      // Download CSV file
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'positions_data.csv'); // set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } else if(response.status === 200 &&(config.method === 'GET' && id )){
      return response.data;
    } 
    else {
      //ManageApiResponse(response, endpoint,config.method);
      return response.data
    }
  } catch (error) {
    if(error.message=="Network Error"){
      state[endpoint].error={...error,statusText:error.message}
    }else if (error.response.status==401) {
      // debugger
      state[endpoint].error = error.response; // Set the error state for status 401
      if(endpoint !== 'forgot'){
        canMakeRequest.value = false;

        localStorage.setItem('token',"")
        router.push({ name: 'login' });
        endpoint !== "login"?window.location.reload():null
      }

    }else{
      state[endpoint].error = error.response;
    }
   
    state[endpoint].loading = false;

    if(endpoint !== 'login' && endpoint !== 'register' && endpoint !== 'verifyOTP' && endpoint !== 'sendForgotOTP' && endpoint !== 'forgot'){
      //ManageApiResponse(error.response, endpoint,config.method);
    }

    return "";
  } finally {
    state[endpoint].loading = false;
    state[endpoint].updating=false;
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const makeRequest = async (endpoint, method, data = {}, config = {},params = {},wait=0,id=null,subEndpoint=null) => {
  let url = getApiUrl(endpoint);
  if(endpoint === "login") canMakeRequest.value = true;
  if (((method === 'DELETE' || method === 'PUT') && id != null) || (method === 'GET' && id != null)) {
    if(subEndpoint==null){
    url=`${url}/${id}`
    }else if(id === 0){
      url=`${url}/${subEndpoint}`
    }else{
      url=`${url}/${subEndpoint}/${id}`
    }
  }
  
  createStateForEndpoint(endpoint);

  const queryParams = new URLSearchParams(params);
  const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;

  if(canMakeRequest.value || endpoint=== "logout"){
    if (method === 'GET') {
      let response=await makeApiRequest({ ...config, method: 'GET', url: fullUrl },wait,endpoint,id);
      return response
    } else if (method === 'POST') {
      let response=await makeApiRequest({ ...config, method: 'POST',url: endpoint==='uploadImage' ? fullUrl : url, data },wait,endpoint,id);
      return response
    } else if (method === 'PUT') {
      let response=await makeApiRequest({ ...config, method: 'PUT', url, data },wait,endpoint,id);
      return response
    } else if (method === 'DELETE') {
      let response=await makeApiRequest({ ...config, method: 'DELETE', url: fullUrl },wait,endpoint,id);
      return response
    } else {
      throw new Error(`Invalid HTTP method: ${method}`);
    }
  } 

  
};

export { makeRequest, canMakeRequest, state,setToken,getToken,getisAuthenticated,setisAuthenticated,logout  };

