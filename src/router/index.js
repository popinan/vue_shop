import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const login = () => import('@/views/login/Login')
const Home = () => import('@/views/home/Home')

const routes = [
  {
    path: '/',
    redirect: '/login' 
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login');
  next()
})

export default router
