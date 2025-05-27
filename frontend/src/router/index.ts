import {createRouter, createWebHashHistory} from "vue-router";

export const routes = [
  {
    path: "/",
    redirect: "/layout/home",
  },
  {
    name: "Layout",
    path: "/layout",
    component: () => import("@/layout"),
    children: [
      {
        name: "Home",
        path: "home",
        component: () => import("@/views/home.tsx"),
      },
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/views/dashboard"),
      },
      {
        name: "Cache",
        path: "cache",
        component: () => import("@/views/cache"),
      },
      {
        name: "Duplicate",
        path: "duplicate",
        component: () => import("@/views/duplicate"),
      },
      {
        name: "Application",
        path: "application",
        component: () => import("@/views/application"),
      },
      {
        name: "Process",
        path: "process",
        component: () => import("@/views/process"),
      },
      {
        name: "BigFile",
        path: "bigFile",
        component: () => import("@/views/big"),
      }
    ],
  },
];
const router = createRouter({
  routes,
  // history: createWebHistory('/access_center/')
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  console.log("aaa", to, from);
  next();
});

export default router;
