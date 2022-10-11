const routes = [
  {
    path: "/",
    component: () => import("auth/pages/IdentityPasswordLoginPage.vue"),
    children: [
      {
        path: "index",
        component: () => import("layouts/AuthenticatedLayout.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
