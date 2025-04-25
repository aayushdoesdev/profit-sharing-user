import { createRouter, createWebHistory } from "vue-router";

// Layouts
import DashboardLayout from "@/layout/DashboardLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import NoSidebarLayout from "@/layout/NoSidebarLayout.vue";

// Pages
import DashboardView from "@/views/dashboard/Main.vue";
import UserManagementView from "@/views/userManagement/Main.vue";
import CalenderView from "@/views/calender/Main.vue";
import StrategiesView from "@/views/strategies/Main.vue";
import AlertsView from "@/views/alert/Main.vue";
import TradeHistoryView from "@/views/tradeHistory/Main.vue";
import ReportsView from "@/views/reports/Main.vue";
import ManualOrders from "@/views/manualOrders/Main.vue"
import ProfileView from "@/views/profile/Main.vue"

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
          path: "/user-management",
          name: "user-management",
          component: UserManagementView,
        },
        {
          path: "/alerts",
          name: "alerts",
          component: AlertsView,
        },
        {
          path: "/strategies",
          name: "strategies",
          component: StrategiesView,
        },
        {
          path: "/reports",
          name: "reports",
          component: ReportsView,
        },
        {
          path: "/manual-orders",
          name: "manual-orders",
          component: ManualOrders,
        },
        {
          path: "/trade-history",
          name: "trade-history",
          component: TradeHistoryView,
        },
      ],
    },
    {
      path: "/",
      name: "",
      component: NoSidebarLayout,
      children: [
        {
          path: "/calender",
          name: "calender",
          component: CalenderView,
        },
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
