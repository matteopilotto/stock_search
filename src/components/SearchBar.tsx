"use client";

import { useState } from "react";
import { getQueryEmbedding } from "@/lib/embeddings";
import { getRelevantContent } from "@/lib/search";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

interface Metadata {
  text: string;
  // TO-DO: Add other metadata fields if needed
}

// Main Match interface matching the structure
export interface Match {
  id: string;
  score: number;
  metadata: Metadata;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      const queryEmbedding = await getQueryEmbedding(searchQuery);
      const relevantContent = await getRelevantContent(queryEmbedding);
      const textContent = relevantContent.matches.map(
        (match: Match) => match.metadata.text
      );
      // console.log("Query embedding:", queryEmbedding);
      console.log("Relevant content:", textContent);
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center mt-8">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-full max-w-3xl px-6 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      ></input>
    </form>
  );
}
