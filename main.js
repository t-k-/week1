import Vue from 'vue'
import VueRouter from 'vue-router'
import mainApp from './main.vue'
import Route1 from './route1.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	//mode: 'history',
	routes: [
		{
			path: '/:id',
			component: Route1
		}
	]
})

new Vue({
  el: '#main_app',
  router,
  render: h => h(mainApp)
})
