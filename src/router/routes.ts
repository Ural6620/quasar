import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login/TheLogin.vue') },
      { path: 'sign-in', component: () => import('pages/login/SignIn.vue') },
      { path: 'sign-up', component: () => import('pages/login/SignUp.vue') },
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {path: '', component: () => import('pages/admin/TheDashboard.vue') },
      { path: 'tasks', component: () => import('pages/admin/tasks/TheTasks.vue') },
      { path: 'today', component: () => import('pages/admin/TheToday.vue') },
      { path: 'calendar', component: () => import('pages/admin/TheCalendar.vue') },
      { path: 'sticky-wall', component: () => import('pages/admin/sticky-wall/TheStickyWall.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
