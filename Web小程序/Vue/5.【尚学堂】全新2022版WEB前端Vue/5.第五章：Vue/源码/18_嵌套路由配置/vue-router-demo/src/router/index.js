import { createRouter, createWebHistory } from 'vue-router'
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
    // 重定向
    redirect:"/about/us",
    component: () => import('../views/AboutView.vue'),
    children:[
      {
        // 二级导航的路径不要加 /
        path:"us",
        component:() => import("../views/AboutSub/AboutUS.vue")
      },
      {
        path:"info",
        component:() => import("../views/AboutSub/AboutInfo.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
