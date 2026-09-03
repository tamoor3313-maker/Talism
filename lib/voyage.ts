/**
 * TALISM uses Voyage AI for profile embeddings — Anthropic recommends
 * Voyage as its embeddings partner since Claude itself has no embeddings
 * endpoint. https://docs.voyageai.com
 */
export async function embedText(text: string): Promise<number[]> {
  if (!process.env.VOYAGE_API_KEY) {
    throw new Error("VOYAGE_API_KEY is not configured on the server");
  }

  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      model: "voyage-2",
      input_type: "document",
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage embeddings request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data[0].embedding as number[];
}

export function profileToEmbeddingText(profile: {
  bio?: string | null;
  relationship_goals?: string | null;
  values_list?: string[] | null;
  deal_breakers?: string[] | null;
  interests?: string[] | null;
}): string {
  return [
    profile.bio,
    profile.relationship_goals,
    profile.values_list?.length ? `Values: ${profile.values_list.join(", ")}` : null,
    profile.deal_breakers?.length ? `Deal-breakers: ${profile.deal_breakers.join(", ")}` : null,
    profile.interests?.length ? `Interests: ${profile.interests.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
