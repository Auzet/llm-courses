import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

export async function loadDocument(file: File): Promise<string[]> {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const tmpPath = join(tmpdir(), `${randomUUID()}-${file.name}`);

    try {
        // Сохраняем во временную папку (требуют все FS-лоадеры)
        await writeFile(tmpPath, Buffer.from(await file.arrayBuffer()));

        let loader;
        if (ext === "pdf") loader = new PDFLoader(tmpPath, { splitPages: true });
        else if (ext === "docx") loader = new DocxLoader(tmpPath);
        else loader = new TextLoader(tmpPath);

        const chunks: string[] = [];
        for (const doc of await loader.load()) {
            chunks.push(doc.pageContent);
        }
        return chunks;
    } finally {
        // Гарантированная очистка /tmp после вызова
        await unlink(tmpPath).catch(() => { });
    }
}
