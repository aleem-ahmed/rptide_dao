// [IMPORT] //
import Vue from 'vue'
import VueRouter from 'vue-router'


// [IMPORT] Personal (Ordered by path) //


// [INIT] //
const routes = []


Vue.use(VueRouter)


const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: routes,

	// [VUE-ROUTER] Scroll Behavior //
	scrollBehavior () { return { x: 0, y: 0 } }
})

// [VUE-ROUTER-SET-TITLE] //
router.beforeEach((to, from, next) => {
	document.title = to.meta.title + ' — '
	next()
})

export default router

export { routes }
