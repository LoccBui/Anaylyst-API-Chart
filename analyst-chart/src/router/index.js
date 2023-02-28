// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Chart from '@/components/Chart.vue'
import PieChart from '@/components/PieChart.vue'

const routes = [
  {path: '/',  component: Chart},
  {path: '/pie',  component: PieChart},

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
