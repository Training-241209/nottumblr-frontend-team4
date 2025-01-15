import React, { useState } from "react";
import { useGiphy } from "@/components/posts/hooks/use-giphy";

const GiphySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: gifs, isLoading, isError } = useGiphy(searchTerm);

  return (
    <div className="giphy-search">
      <input
        type="text"
        placeholder="Search for GIFs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-full"
      />

      {isLoading && <p>Loading GIFs...</p>}
      {isError && <p>Error loading GIFs. Please try again.</p>}

      <div className="giphy-results grid grid-cols-3 gap-4 mt-4">
        {gifs?.map((gif) => (
          <div key={gif.id} className="gif-item">
            <img src={gif.mediaUrl} alt={gif.title} className="w-full h-auto rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiphySearch;
