import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Home from './pages/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'Home Page',
    },
    component: Home,
  },
  {
    path: '/chat',
    name: 'Chat',
    meta: {
      title: 'Chat',
    },
    component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    meta: {
      title: '404',
    },
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((route) => route.meta?.title)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  }

  next()
})
