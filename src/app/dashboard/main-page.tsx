import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function MainPage({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="border-b-[1px] border-neutral-300 dark:border-neutral-800 sticky top-0 flex h-12 shrink-0 items-center gap-2 bg-white dark:bg-black">
          <div className="flex justify-center gap-2 md:justify-start dark:text-neutral-100 z-10">
            <SidebarTrigger />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    For You | Following
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-9 p-6 dark:text-neutral-100 dark:bg-black">
          {children}
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
