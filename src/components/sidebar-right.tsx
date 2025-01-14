import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import CreatePostDialog from "./posts-dialog";
import { useState } from "react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Search Nott",
      onClick: () => {},
      icon: Search,
    },
  ],
};

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [items, setItems] = useState<Array<{
    id: number;
    creatorName: string;
    username: string;
    title: string;
    body: string;
    avatarUrl: string;
    comments: string[];
  }>>([]);
  
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l-[1px] dark:border-neutral-800 dark:bg-black dark:text-neutral-100"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border h-12 dark:border-neutral-800 dark:bg-black dark:text-neutral-100">
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
        <CreatePostDialog 
            onCreatePost={(newPost) => {
              // Add the new post to your items array
              setItems(prev => [newPost, ...prev]);
            }} 
          />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
