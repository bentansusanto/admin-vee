"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar, IconCircle,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
  IconDiamond
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Toby Belhome",
    email: "m@example.com",
    avatar: "https://www.tobybelhome.com/toby-belhome.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconDiamond,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconListDetails,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconChartBar,
    },
    {
      title: "Login",
      url: "/login",
      icon: IconFolder,
    },
    {
      title: "Register",
      url: "/register",
      icon: IconUsers,
    },
    {
      title: "404 Page",
      url: "/404-page",
      icon: IconFolder,
    },
    {
      title: "500 Page",
      url: "/500-page",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Get Pro",
      url: "https://shadcnuikit.com/pricing",
      icon: IconCircle,
    },
    {
      title: "Shadcn UI Kit",
      url: "https://shadcnuikit.com/",
      icon: IconCircle,
    },
    {
      title: "Bundui Component",
      url: "https://bundui.io",
      icon: IconCircle,
    },
  ],
}

import { useAppSelector } from "@/redux/hooks";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  
  // Prepare user data for NavUser component
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "https://github.com/shadcn.png", // Default avatar fallback
  };

  // We keep the static data for navigation but update URLs
  const navMain = data.navMain.map(item => ({
    ...item,
    url: item.url === "/dashboard/default" ? "/dashboard" : item.url
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <img src="https://shadcnuikit.com/logo.png" className="size-6 rounded-sm group-data-[collapsible=icon]:size-5" alt="shadcn ui kit svg logo" />
                <span className="text-base font-medium">Veepearl Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
