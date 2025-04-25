import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";
import CryptoJS from 'crypto-js'
import * as lucideIcons from "lucide-vue-next";

export const useProfileStore = defineStore('profiles', () => {
  const endpoint='profile'
  const wait=0

  const key1 = 'abcdABCD12'
  const key2 = '34efgHIJ'
  const key3 = 'KL5678hij'
  const key4 = 'klMnO'
  const permissionsList = ref([])

  const profile = ref({});
  const userInfo = ref({});
  const currentPage = ref(1);

  const iconsData = ref([]);
 




  async function getUserInfo() {
    try {
      // if ((Object.keys(profile.value).length === 0)){
        const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
        if (response.data){
          profile.value = response.data;
          profile.value.profile_picture_url="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        } else {
          profile.value = {};
        }
    } catch (error) {
      throw error;
    }
  }

 // addEditProfile function edit user
  async function addEditProfile( formdata, subDomain) {
    try {
      if(subDomain){
        await makeRequest(endpoint, "PUT",formdata, {}, {},0, subDomain);
      } else{
        await makeRequest(endpoint, "PUT",formdata, {}, {},0);
      }
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
  }

  // Other store actions and properties here...

  function handlePermissionDecrypt() {
      try {
          const secretData = localStorage.getItem('list_auth')
          if (!secretData) {
              throw new Error('No data found in list itmes local')
          }

          const encryptedDataBytes = CryptoJS.enc.Base64.parse(secretData)
          const iv = CryptoJS.lib.WordArray.create(encryptedDataBytes.words.slice(0, 4), 16)

          const encryptedWords = encryptedDataBytes.words.slice(4)
          const encrypted = CryptoJS.lib.WordArray.create(
              encryptedWords,
              encryptedDataBytes.sigBytes - 16
          )

          const keyy = key1 + key2 + key3 + key4
          const key = CryptoJS.enc.Utf8.parse(keyy)

          const cipherParams = CryptoJS.lib.CipherParams.create({
              ciphertext: encrypted,
              iv: iv,
              key: key
          })

          const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
              iv: iv,
              mode: CryptoJS.mode.CFB,
              padding: CryptoJS.pad.NoPadding
          }).toString(CryptoJS.enc.Utf8)

          permissionsList.value = JSON.parse(decrypted)

      } catch (error) {
          // console.error('Error in decry:', error.message || error)
      }
  }


  

  const fetchIcons = () => {
    let icons = [];
    for (const [key, icon] of Object.entries(lucideIcons)) {
      icons.push(`${key}Icon`)
    }
    iconsData.value = icons;
  };


  handlePermissionDecrypt()

  fetchIcons()

  return {
    getUserInfo,
    addEditProfile,
    userInfo,
    profile,
    iconsData,
    currentPage,
    state,
    endpoint
  };
});
