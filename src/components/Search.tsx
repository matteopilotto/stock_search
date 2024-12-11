"use client";

import { useState } from "react";
import { Match, SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { getQueryEmbedding } from "@/lib/embeddings";
import { getRelevantContent } from "@/lib/search";
import { Loader2 } from "lucide-react";

const formatMetadataToMarkdown = (metadata: any): string => {
  const fields = [
    "Ticker",
    "Name",
    "City",
    "State",
    "Country",
    "Industry",
    "Sector",
    "Business Summary",
  ];

  return fields
    .map((field) => `**${field}:**\n${metadata[field] || "N/A"}`)
    .join("\n\n");
};

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const queryEmbedding = await getQueryEmbedding(query);
      const relevantContent = await getRelevantContent(queryEmbedding);
      //   const textContent = relevantContent.matches.map(
      //     (match: Match) => match.metadata.text
      //   );
      const formattedContent = relevantContent.matches.map((match: Match) =>
        formatMetadataToMarkdown(match.metadata)
      );
      //   setSearchResults(textContent);
      setSearchResults(formattedContent);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      {isLoading ? (
        <div className="flex justify-center mt-16">
          <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
        </div>
      ) : (
        searchResults.length > 0 && <SearchResults results={searchResults} />
      )}
    </div>
  );
}
