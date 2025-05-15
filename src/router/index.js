import {createRouter, createWebHistory} from "vue-router"
import MainApp from '../views/MainApp.vue'
import PrintApp from '../views/PrintApp.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [ 
		{
			path:'/',
			name:'main',
			component: MainApp
		},
		{
			path:'/print',
			name:'print',
			component: PrintApp
		}
	]

})
export default router
