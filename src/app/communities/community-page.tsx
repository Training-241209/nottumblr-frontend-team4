import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";

const CommunityGrid = () => {
  const router = useRouter();

  // Sample data for community cards
  const communities = [
    { id: 1, title: "Aesthetic", image: "/aesthetic.png", bg: "bg-pink-200" },
    { id: 2, title: "Anime", image: "/anime-fma.png", bg: "bg-blue-200" },
    { id: 3, title: "Community Spotlight", image: "/community.png", bg: "bg-yellow-200" },
    { id: 4, title: "Books & Literature", image: "/books.png", bg: "bg-green-200" },
    { id: 5, title: "Gaming", image: "/gaming.png", bg: "bg-purple-200" },
    { id: 6, title: "Art", image: "/art.png", bg: "bg-indigo-200" },
    { id: 7, title: "Movies", image: "/movies.png", bg: "bg-red-200" },
    { id: 8, title: "TV Shows", image: "/tv-shows.png", bg: "bg-red-200" },
    { id: 9, title: "Culture", image: "/culture.png", bg: "bg-red-200" },
  ];

  const handleCardClick = (communityTitle: string) => {
    router.navigate({ to: `/dashboard/communities/community/${communityTitle}` });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse Communities</h2>
      </div>

      {/* Grid of Community Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <Card
            key={community.id}
            className="cursor-pointer overflow-hidden transition-all hover:scale-105"
            onClick={() => handleCardClick(community.title)} // Pass the correct community title
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className={`aspect-video w-full ${community.bg}`}>
                  <img
                    src={community.image}
                    alt={community.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {community.title}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityGrid;
