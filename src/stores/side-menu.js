import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
      
      {
        icon: "UsersIcon",
        pageName: "users",
        title: "Users",
        permission: "users",
      },
      {
        icon: "CrownIcon",
        pageName: "subscriptions",
        title: "Subscriptions",
        permission: "subscriptions",
      },
      {
        icon: "LinkIcon",
        pageName: "webhookStrategies",
        title: "Webhook",
        permission: "webhookStrategies",
      },
      {
        icon: "TargetIcon",
        pageName: "group",
        title: "Groups",
        permission: "group",
      },
      {
        icon: "BriefcaseIcon",
        pageName: "products",
        title: "Products",
        permission: "products",
      },
      {
        icon: "ActivityIcon",
        pageName: "signals",
        title: "Signals",
        permission: "signals",
      },

      {
        icon: "BarChart2Icon",
        pageName: "indicator",
        title: "Indicators",
        permission: "indicator",
      },
      {
        icon: "AlignVerticalDistributeCenterIcon",
        pageName: "screener",
        title: "Screener",
        permission: "screener",
      },
      
      // {
      //   icon: "UserIcon",
      //   pageName: "admin-users",
      //   title: "Admin-users", 
      //   permission: "admin-users",
      // },
      // {
      //   icon: "UserIcon",
      //   pageName: "sales-users",
      //   title: "Sales-users", 
      //   permission: "sales-users",
      // },
      {
        icon: "UsersIcon",
        pageName: "brokers",
        title: "Brokers",
        permission: "brokers",
      },
      {
        icon: "CommandIcon",
        pageName: "strategies",
        title: "Strategies",
        permission: "strategies",
      },
      {
        icon: "CommandIcon",
        pageName: "matrix-joiners",
        title: "Matrix Joiners",
        permission: "matrix-joiners",
      },
      {
        icon: "FileTextIcon",
        pageName: "orders",
        title: "Orders",
        permission: "orders",
      },
      {
        icon: "CreditCardIcon",
        pageName: "positions",
        title: "Positions",
        permission: "positions",
      },
      {
        icon: "AlertOctagonIcon",
        pageName: "error-orders",
        title: "Error Orders",
        permission: "error-orders",
      },
      {
        icon: "FileTextIcon",
        pageName: "manage-orders",
        title: "Manage Orders",
        permission: "manage-orders",
      },
      
      
      {
        icon: "CreditCardIcon",
        pageName: "invoice",
        title: "Invoice",
        permission: "invoice",
      },
      {
        icon: "GiftIcon",
        pageName: "offers",
        title: "Offers",
        permission: "offers",
      },
      
      {
        icon: "AlertTriangleIcon",
        pageName: "alerts",
        title: "Alerts",
        permission: "alerts",
      },
      {
        icon: "VideoIcon",
        pageName: "videos",
        title: "Videos",
        permission: "videos",
      },
      {
        icon: "MehIcon",
        pageName: "icons",
        title: "Icons",
        permission: "icons",
      },

      {
        icon: "EditIcon",
        pageName: "editor",
        title: "Editor",
        permission: "editor",
      },
    ],
  }),
});
