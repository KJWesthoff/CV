import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Icon from './components/Icon.vue'
import router from './router'


const app = createApp(App)

app.component("Icon", Icon)
app.use(router)
app.mount('#app')
