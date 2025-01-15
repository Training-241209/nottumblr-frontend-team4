import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrendingPostCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto p-1.5"> 
      <CardHeader className="border-b border-neutral-700 pb-1">
        <CardTitle className="text-sm">Trending Post</CardTitle> 
      </CardHeader>
      <CardContent className="space-y-1.5 flex flex-col items-center pt-4"> {/* Added padding to the top */}
        <a
          href="https://giphy.com/gifs/thedudeperfectshow-cmt-the-dude-perfect-show-l3V0lsGtTMSB5YNgc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <img
            src="https://media3.giphy.com/media/l3V0lsGtTMSB5YNgc/giphy.gif"
            alt="Trending GIF"
            className="rounded-lg w-full max-h-32 object-contain"
          />
        </a>
      </CardContent>
    </Card>
  );
};

export default TrendingPostCard;
