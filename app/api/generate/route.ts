// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { configDotenv } from "dotenv";
import { StudyPlanSchema } from "@/schemas/StudyPlanSchema";

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

    const documentText = await file.text();

    const model = new ChatOpenAI({
      model: process.env.MODEL_NAME || "qwen3.5:9b",
      apiKey: process.env.OPENAI_API_KEY,
      configuration: { baseURL: process.env.LMSTUDIO_BASE_URL },
    });

    const structuredModel = model.withStructuredOutput(StudyPlanSchema, {
      name: "study_plan",
    });

    // Шаблон с двумя плейсхолдерами
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "Ты образовательный эксперт. Проанализируй данный документ и подготовь структурированный пошаговый план обучения по данной теме. Следуй предоставленным пользователем инструкциям, если таковые имеются."],
      [
        "human",
        `Содержимое документа:\n{document}\n\n💡 Дополнительные инструкции:\n{userPrompt}\n`,
      ],
    ]);

    // Цепочка через .pipe()
    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    // Запускаем стриминг
    const stream = await chain.stream({ document: documentText, userPrompt });

    // Преобразуем AsyncIterable в Web ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Ошибка при генерации плана" }, { status: 500 });
  }
}