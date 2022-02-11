import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const login = () => import('@/views/login/Login')
const Home = () => import('@/views/home/Home')
const Welcome = () => import('@/views/home/childcomp/Welcome')
const Users = () => import('@/views/home/childcomp/Users')
const Rights = () => import('@/views/home/childcomp/Rights')
const Roles = () => import('@/views/home/childcomp/Roles')
const Categories = () => import('@/views/home/childcomp/Categories')
const Params = () => import('@/views/home/childcomp/Params')

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
    component: Home,
    children: [{
      path: '',
      redirect: 'welcome',
    }, 
    {
      path: 'welcome',
      component: Welcome,
    },
    {
      path: 'users',
      component: Users,
    },
    {
      path: 'rights',
      component: Rights,
    },
    {
      path: 'roles',
      component: Roles,
    },
    {
      path: 'categories',
      component: Categories,
    },
    {
      path: 'params',
      component:Params,
    },
  ]
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
