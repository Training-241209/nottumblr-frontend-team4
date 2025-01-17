import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import CreatePostDialog from "../posts/create-posts-dialog";
import TopBloggersCard from "../posts/top-bloggers-card";
import TrendingPostCard from "../posts/trending-posts-card";


export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l-[1px] dark:border-neutral-800 dark:bg-black dark:text-neutral-100"
      {...props}
    >
      <SidebarHeader >

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
