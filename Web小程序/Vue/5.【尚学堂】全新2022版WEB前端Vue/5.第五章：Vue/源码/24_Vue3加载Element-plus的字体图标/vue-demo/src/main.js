import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import elementIcon from "./plugins/icons";

createApp(App).use(elementIcon).mount('#app')
