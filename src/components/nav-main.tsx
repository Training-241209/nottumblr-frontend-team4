"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className="hover:bg-gray-100 hover:scale-105 dark:hover:bg-gray-800 dark:hover:scale-105 transition-transform duration-200 p-2 text-base">
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url} className="flex items-center gap-2">
              <item.icon style={{ width: '22px', height: '50px' }} />
              <span className = "text-md">{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
