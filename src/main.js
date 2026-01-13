import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from "./router";
import { useNotifications } from '@/composables/useNotifications'

const app = createApp(App)

useNotifications() // 👈 ИНИЦИАЛИЗАЦИЯ ОДИН РАЗ

app.use(router)
app.mount('#app')
