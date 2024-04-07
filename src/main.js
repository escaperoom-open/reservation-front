import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios';

import CafeList from './views/CafeList.vue'

loadFonts()

const router = createRouter({
  history: createWebHistory(),
  routes : [
      {
          path : '/',
          name : 'CafeList',
          component : CafeList,
      }
  ]
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')

axios.defaults.baseURL = 'http://localhost:8080'; 
axios.defaults.withCredentials = true;
