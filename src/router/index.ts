import { defineRouter } from '#q-app/wrappers';
import routes from './routes';

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const isAuthRoute = to.path === '/sign-in' || to.path === '/sign-up' || to.path === '/';
    const isAdminRoute = to.path.startsWith('/admin');

    if (isAdminRoute) {
      if (token) {
        next();
      } else {
        next('/sign-in');
      }
    } else if (isAuthRoute && token) {
      next('/admin');
    } else {
      next();
    }
  });

  return Router;
});
