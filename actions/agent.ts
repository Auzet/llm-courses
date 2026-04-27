import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { configDotenv } from "dotenv";

async function main() {
    configDotenv();

    const model = new ChatOpenAI({
        model: "qwen3.5:9b",
        apiKey: process.env.OPENAI_API_KEY,
        configuration: {
            baseURL: process.env.LMSTUDIO_BASE_URL,
        },
    });

    const subject = "Python programming";

    const template = `The subject is: {subject}
An answer in the following format:
Study Plan:
1. [step 1]
2. [step 2]
3. [step 3]
...
n. [step n]`;

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an expert educator. When given a subject, you will create a structured, step-by-step study plan."],
        [
            "human", template
        ],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const stream = await chain.stream({
        subject: subject,
    });
    for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
}



main().catch(console.error);
