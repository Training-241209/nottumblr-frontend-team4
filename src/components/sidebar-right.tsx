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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="!bg-white text-black hover:!bg-sky-300">
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md text-white min-w-[830px] max-w-[830px] min-h-[830px] max-h-[830px]">
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
                <DialogDescription>
                  Write a post, ask a question, share a link, and more.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <div className="grid w-full gap-1.5">
                    <Textarea
                      className="resize-none w-full min-h-[650px] max-h-[650px]"
                      placeholder="Type your message here."
                      id="message-2"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="submit">Post</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
