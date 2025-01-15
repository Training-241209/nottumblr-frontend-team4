"use client"

import * as React from "react"
import {
  Home,
  Telescope,
  UserCog,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/sidebars/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Logo from "./logo"
import { useAuth } from "../auth/hooks/use-auth"
import { useRouter } from "@tanstack/react-router"

// This is sample data.
function useNavData() {
  const router = useRouter();
  
  return {
    navMain: [
      {
        title: "Home",
        onClick: () => router.navigate({ to: '/dashboard/timeline' }),
        icon: Home,
      },
      {
        title: "Explore",
        onClick: () => router.navigate({ to: '/dashboard/explore' }),
        icon: Telescope,
      },
      {
        title: "Communities",
        onClick: () => router.navigate({ to: '/dashboard/communities' }),
        icon: Users,
      },
      {
        title: "Account Settings",
        onClick: () => router.navigate({ to: '/dashboard/settings' }),
        icon: UserCog,
        badge: "10",
      },
    ],
  }
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data : user } = useAuth();
  const data = useNavData();

  return (
    <Sidebar className="dark:border-neutral-800 dark:bg-black dark:text-neutral-100" {...props}>
      <SidebarHeader>
        <Logo className= "h-32 w-auto"/>
        <NavUser user={{ username: user?.username || "Guest", email: user?.email || "guest@nottumblr.com" }} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
