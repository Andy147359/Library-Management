// Main CSS
import './assets/main.css'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Fontawsome
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})
localStorage.setItem("userRole", "admin")

createApp(App)
    .use(router)
    .use(vuetify)
    .mount("#app");
