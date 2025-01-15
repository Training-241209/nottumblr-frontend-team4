import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ExplorePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl font-bold">Explore</h1>
      </div>

      {/* Filters */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button variant="outline" size="lg">
          Trending
        </Button>
        <Button variant="outline" size="lg">
          Latest
        </Button>
        <Button variant="outline" size="lg">
          People
        </Button>
        <Button variant="outline" size="lg">
          Hashtags
        </Button>
      </div>

      {/* Trending Posts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Trending Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle>Post Title {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A short preview of the post content. It could also include hashtags like 
                  <Badge className="ml-1">#hashtag</Badge>.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Hashtags */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Trending Hashtags</h2>
        <div className="flex flex-wrap gap-2">
          {["#Travel", "#Photography", "#Tech", "#Fitness", "#Music"].map((tag, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      {/* Suggested People */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Suggested People</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg">
              <CardHeader className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://via.placeholder.com/150?text=User+${index + 1}`} alt={`User ${index + 1}`} />
                  <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">User {index + 1}</p>
                  <p className="text-sm text-gray-500">@username{index + 1}</p>
                </div>
              </CardHeader>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Follow
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}