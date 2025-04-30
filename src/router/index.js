import { createRouter, createWebHistory } from "vue-router";

// Layouts
import DashboardLayout from "@/layout/DashboardLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import NoSidebarLayout from "@/layout/NoSidebarLayout.vue";

// Pages
import DashboardView from "@/views/dashboard/Main.vue";
import ProfileView from "@/views/profile/Main.vue"
import ReferView from "@/views/refer/Main.vue"

import LoginView from "@/views/auth/login/Main.vue";
import RegistrationView from "@/views/auth/registration/Main.vue";
import ForgotPassword from "@/views/auth/forgotPassword/Main.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "",
      component: DashboardLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: DashboardView,
        },
        
        {
          path: "/refer",
          name: "refer",
          component: ReferView,
        }
      ],
    },
    {
      path: "/",
      name: "",
      component: NoSidebarLayout,
      children: [
        
        {
          path: "/profile",
          name: "profile",
          component: ProfileView,
        },
      ],
    },
    {
      path: "/",
      name: "",
      component: LoginLayout,
      children: [
        {
          path: "/login",
          name: "login",
          component: LoginView,
        },
        {
          path: "/register",
          name: "register",
          component: RegistrationView,
        },
        {
          path: "/forgot-password",
          name: "forgot-password",
          component: ForgotPassword,
        },
      ],
    },
  ],
});

export default router;
