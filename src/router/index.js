import {createRouter, createWebHistory} from "vue-router"
import MainApp from '../views/MainApp.vue'


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [ 
		{
			path:'/',
			name:'main',
			component: MainApp
		}
	]

})
export default router
