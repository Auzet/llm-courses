import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export async function linkChunksToPhase(
  sourceId: string,
  phaseNumber: number,
  phaseKeywords: string[] // например: ["async/await", "promises", "event loop"]
): Promise<{ updated: number }> {
  const embeddings = new OpenAIEmbeddings({
    modelName: process.env.EMBEDDING_MODEL || "nomic-embed-text",
    configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
  });

  const vectorStore = new Chroma(embeddings, {
    collectionName: "study-docs",
    url: process.env.CHROMA_URL || "http://localhost:8000",
  });

  // 🔍 Находим чанки по ключевым словам фазы + фильтруем по sourceId
  const query = phaseKeywords.join(" ");
  const results = await vectorStore.similaritySearchWithScore(query, 20, {
    where: { sourceId }, // фильтр только по этому документу
  });

  // 🔄 Обновляем метаданные найденных чанков
  let updated = 0;
  for (const [doc, score] of results) {
    if (score < 0.3) continue; // отбрасываем слабые совпадения
    
    await vectorStore._collection.update(doc.metadata.id, {
      metadata: {
        ...doc.metadata,
        phase: `phase_${phaseNumber}`,
        topic: phaseKeywords[0] || "",
      },
    });
    updated++;
  }

  return { updated };
}