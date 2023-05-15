import { createApp } from "/CV/node_modules/.vite/deps/vue.js?v=6a46a254"
import "/CV/src/style.css?t=1683923059188"
import App from "/CV/src/App.vue?t=1683923059188"
import icon from "/CV/src/components/icon.vue?t=1683907525887"

const app = createApp(App)

app.component("icon", icon)
app.mount('#app')