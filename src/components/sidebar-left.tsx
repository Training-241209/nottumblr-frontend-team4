"use client"

import * as React from "react"
import {
  Home,
  Inbox,
  Telescope,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Logo from "./logo"
import { useAuth } from "./auth/hooks/use-auth"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Explore",
      url: "#",
      icon: Telescope,
    },
    {
      title: "Commmunities",
      url: "#",
      icon: Users,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data : user } = useAuth();

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
