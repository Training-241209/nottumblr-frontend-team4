import * as React from "react";
import { Search } from "lucide-react";
import { NavMain } from "@/components/sidebars/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import CreatePostDialog from "../posts/create-posts-dialog";
import { useState } from "react";
import TopBloggersCard from "../posts/top-bloggers-card";
import TrendingPostCard from "../posts/trending-posts-card";

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
  const [items, setItems] = useState<
    Array<{
      id: number;
      creatorName: string;
      username: string;
      title: string;
      body: string;
      avatarUrl: string;
      comments: string[];
    }>
  >([]);

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l-[1px] dark:border-neutral-800 dark:bg-black dark:text-neutral-100"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border h-12 dark:border-neutral-800 dark:bg-black dark:text-neutral-100">
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="w-full max-w-sm mx-auto pt-4 h-[300px] space-y-8">
          <TrendingPostCard />
          <TopBloggersCard />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <CreatePostDialog />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
