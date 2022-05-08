import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import DataVisualPanel from '@/views/dv-panel.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dvp',
  },
  {
    path: '/dvp',
    name: 'DataVisualPanel',
    component: DataVisualPanel,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
