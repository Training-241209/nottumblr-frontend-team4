import { SidebarLeft } from "@/components/sidebars/sidebar-left";
import { SidebarRight } from "@/components/sidebars/sidebar-right";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { memo, useState, useCallback } from "react";
import { useSearchBloggers } from "@/components/auth/hooks/use-search";
import { useRouter } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";

const MainPage = memo(({ children }: { children?: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const { data: searchResults, isLoading } = useSearchBloggers(searchTerm);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearchOpen(true);
  }, []);

  const handleSelectBlogger = useCallback((username: string) => {
    setIsSearchOpen(false);
    setSearchTerm("");
    router.navigate({
      to: '/dashboard/other-profile/$username',
      params: { username },
    });
  }, [router]);

  const getProfilePictureUrl = (path: string | undefined) =>
    path
      ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${path}`
      : "/lbj.png";

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="border-b-[1px] border-neutral-300 dark:border-neutral-800 sticky top-0 z-50 flex h-12 shrink-0 items-center justify-between bg-white dark:bg-black px-4">
          <div className="flex items-center gap-2 dark:text-neutral-100">
            <SidebarTrigger />
            <ModeToggle />
            <Separator orientation="vertical" className="h-4" />
          </div>

          <div className="flex-1 max-w-2xl mx-4 relative" style={{ left: "10px" }}>
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search users..."
                className="w-full pl-9 h-8 text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>

            {isSearchOpen && searchTerm.length >= 2 && (
              <div className="absolute w-full mt-1 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-800">
                <div className="max-h-[300px] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-neutral-500">Searching...</div>
                  ) : searchResults?.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500">No users found</div>
                  ) : (
                    <ul>
                      {searchResults?.map((blogger) => (
                        <li
                          key={blogger.bloggerId}
                          onClick={() => handleSelectBlogger(blogger.username)}
                          className="flex items-center text-neutral-300 gap-3 p-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getProfilePictureUrl(blogger.profilePictureUrl)}
                              alt={blogger.username}
                            />
                            <AvatarFallback>
                              {blogger.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">@{blogger.username}</p>
                            {blogger.fullName && (
                              <p className="text-sm text-neutral-500">{blogger.fullName}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-[100px]" />
        </header>

        {isSearchOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
        )}

        <div className="flex flex-1 flex-col gap-9 p-6 dark:text-neutral-100 dark:bg-black">
          {children}
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
});

export default MainPage;
