
import { createRouter, createWebHistory } from 'vue-router'
import mainTemplate from '../components/mainTemplate.vue'
import managerTemplate from '../components/managerTemplate.vue'



const routes = [
  {
    path: '/',
    name: 'mainTemplate',
    component: mainTemplate
  },
 
  {
    path: '/manager',
    name: 'manager',
    component: managerTemplate
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0, behavior: "smooth" })
      }, 500)
    })
  },
})



export default router
