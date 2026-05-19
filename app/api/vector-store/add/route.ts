// app/api/vector-store/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("document") as File;
  const sourceId = formData.get("sourceId") as string || crypto.randomUUID();
  
  const text = await file.text();
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 120 });
  const chunks = await splitter.splitText(text);

  const embeddings = new OpenAIEmbeddings({
    modelName: "mxbai-embed-large-v1",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
  });

  const vectorStore = new Chroma(embeddings, {
    collectionName: "study-docs",
    url: process.env.CHROMA_URL || "http://localhost:8000",
  });

  export async function linkChunksToPhase(
  sourceId: string,
  phaseNumber: number,
  phaseKeywords: string[]
): Promise<{ updated: number }> {
  const query = phaseKeywords.join(" ");
  const results = await vectorStore.similaritySearchWithScore(query, 20, {
    where: { sourceId }
  });
  
  let updated = 0;
  for (const [doc, score] of results) {
    if (score < 0.3) continue; // порог релевантности
    
    await vectorStore._collection.update(doc.metadata.id, {
      metadata: {
        ...doc.metadata,
        phase: `phase_${phaseNumber}`,
        topic: phaseKeywords[0] || ""
      }
    });
    updated++;
  }
  return { updated };
}

  // 🔑 Добавляем метаданные к каждому чанку
  const docs = chunks.map((content, i) => ({
    pageContent: content,
    metadata: {
      source: file.name,
      sourceId,
      chunkIndex: i,
      phase: "unassigned", // Позже можно обновить через API
      topic: "",
    },
  }));

  await vectorStore.addDocuments(docs);
  return NextResponse.json({ success: true, chunks: chunks.length, sourceId });
}

interface ChunkMetadata {
  sourceId: string;      // UUID документа
  sourceName: string;    // Имя файла
  phase?: string;        // Привязка к этапу плана ("phase_3")
  topic?: string;        // Тема внутри этапа
  chunkIndex: number;    // Порядковый номер
  uploadedAt: string;    // ISO-дата
}