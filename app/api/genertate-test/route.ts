// app/api/generate-test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export const runtime = "nodejs";

const TestSchema = z.object({
  phase_title: z.string(),
  questions: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      options: z.array(z.string()).length(4),
      correct_answer: z.string(),
      explanation: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const { phaseTitle, phaseFocus, numQuestions = 5 } = await req.json();

  const embeddings = new OpenAIEmbeddings({
    modelName: "nomic-embed-text",
    configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
  });

  const vectorStore = new Chroma(embeddings, {
    collectionName: "study-docs",
    url: process.env.CHROMA_URL || "http://localhost:8000",
  });

  // 🔍 Поиск по смыслу этапа
  const retriever = vectorStore.asRetriever({ k: 8 });
  const relevantDocs = await retriever.invoke(`${phaseTitle} ${phaseFocus}`);
  const context = relevantDocs.map(d => d.pageContent).join("\n---\n").slice(0, 12000);

  const model = new ChatOpenAI({
    model: process.env.MODEL_NAME || "qwen3.5:9b",
    configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
  }).withStructuredOutput(TestSchema, { name: "test" });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Expert educator. Create multiple-choice tests based ONLY on the provided context."],
    [
      "human",
      `📖 Context (Phase: {phaseTitle}):\n{context}\n\n💡 Focus: {phaseFocus}\n\n📝 Generate {numQuestions} questions. Output valid JSON.`
    ],
  ]);

  const result = await prompt.pipe(model).invoke({
    phaseTitle, phaseFocus, context, numQuestions,
  });

  return NextResponse.json(result);
}