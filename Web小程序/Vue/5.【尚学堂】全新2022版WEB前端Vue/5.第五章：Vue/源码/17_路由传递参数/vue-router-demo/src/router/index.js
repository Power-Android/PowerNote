import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path:"/news",
    name:"news",
    // 这是异步加载方式
    component:() => import("../views/NewsView.vue")
  },
  {
    path:"/newsdetails/:name",
    name:"newsdetails",
    component:() =>import("../views/NewsDetailsView.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
