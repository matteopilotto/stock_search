import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(request: Request) {
  try {
    const { embedding: queryEmbedding } = await request.json();

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      return NextResponse.json(
        { error: "Invalid embedding vector format." },
        { status: 400 }
      );
    }

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const relevantContent = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const matches = relevantContent.matches.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));

    return NextResponse.json({ matches: matches }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve relevant content." },
      { status: 500 }
    );
  }
}
