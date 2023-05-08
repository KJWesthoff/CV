import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import icon from './components/icon.vue'

const app = createApp(App)

app.component("icon", icon)
app.mount('#app')