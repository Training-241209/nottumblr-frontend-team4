import React, { useState, useEffect, useRef } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from "./ui/card";
// Define the types for the timeline item
interface TimelineItem {
  id: number;
  title: string;
  body: string;
  avatarUrl: string;
}
const CommentTimeline: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([]); // State for timeline items
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const bottomRef = useRef<HTMLDivElement>(null); // Ref to detect scroll position
  // Simulated data fetch (replace with real API call)
  const fetchData = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newItems: TimelineItem[] = Array.from({ length: 5 }, (_, index) => ({
        id: Date.now() + index,
        title: `Post ${Date.now() + index}`,
        body: "This is a description of the post.",
        avatarUrl: "https://www.w3schools.com/w3images/avatar2.png",
      }));
      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
    }, 1000); // Simulate network delay
  };
  // Detect scroll event to trigger fetch
  const handleScroll = () => {
    if (bottomRef.current) {
      const bottom = bottomRef.current.getBoundingClientRect().bottom;
      if (bottom <= window.innerHeight) {
        fetchData();
      }
    }
  };
  // Initial data load and scroll event listener
  useEffect(() => {
    fetchData(); // Initial load
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);
  return (
    <div className="min-w-[896px] max-w-4xl mx-auto">
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-gray-800 shadow rounded-lg flex items-start space-x-4"
          >
            <Card>
              <CardHeader>
                <CardTitle><h3 className="text-white font-semibold min-w-[830px] max-w-[830px] mx-auto">{item.title}</h3></CardTitle>
                  <CardDescription><img
                    src={item.avatarUrl}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                    
                  />
                  
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white">{item.body}</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center py-4 text-white">Loading...</div>
      )}
      <div ref={bottomRef} className="h-10"></div> {/* Invisible div to trigger scroll */}
    </div>
  );
};
export default CommentTimeline;