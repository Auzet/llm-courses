// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { configDotenv } from "dotenv";
import { StudyPlanSchema } from "@/schemas/StudyPlanSchema";
import { loadDocument } from "@/actions/fileLoader";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    configDotenv();
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    const userPrompt = formData.get("prompt") as string || "";

    if (!file) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Лимит 15 МБ" }, { status: 413 });
    }

    const rawChunks = await loadDocument(file);

    let documentText = rawChunks.join("\n\n");
    /* if (documentText.length > 25000) {
      documentText = documentText.slice(0, 25000) + "\n\n[⚠️ Часть документа пропущена из-за лимита контекста]";
    } */

    const model = new ChatOpenAI({
      model: process.env.MODEL_NAME || "qwen3.5:9b",
      apiKey: process.env.OPENAI_API_KEY,
      configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
    });

    const structuredModel = model.withStructuredOutput(StudyPlanSchema, {
      name: "study_plan",
    });

    // Шаблон с двумя плейсхолдерами
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "Ты образовательный эксперт. Проанализируй данный документ и подготовь структурированный пошаговый план обучения по данной теме. Следуй предоставленным пользователем инструкциям, если таковые имеются."],
      [
        "human",
        `Содержимое документа:\n{document}\n\n Дополнительные инструкции:\n{userPrompt}\n`,
      ],
    ]);

    // Цепочка через .pipe()
    const chain = prompt.pipe(structuredModel);
    const result = await chain.invoke({ document: documentText, userPrompt });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Не удалось сформировать план. Проверьте файл или параметры модели." },
      { status: 500 }
    );
  }
}