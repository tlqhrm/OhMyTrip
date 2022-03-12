const routes = [
  {
    path: "/images",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/images.vue") }],
  },
  {
    path: "/map",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Map.vue") }],
  },
  {
    path: "/articles",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/articles.vue") }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
