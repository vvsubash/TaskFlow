import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/routes/login.vue'
import Home from '@/routes/index.vue'
import NewTask from '@/routes/tasks/new.vue'
import Task from '@/routes/tasks/[id].vue'
import TestStatus from '@/routes/TestStatus.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // component: Home,
      redirect: '/login',
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/test-status',
      component: TestStatus,
    },
    {
      path: '/tasks',
      children: [
        {
          path: 'new',
          component: NewTask,
        },
        {
          path: ':id',
          component: Task,
        },
      ],
    },
  ],
})

export default router
