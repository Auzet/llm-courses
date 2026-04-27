"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function StudyPlanGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setOutput("");
    setError("");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(errData.error || "Request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("ReadableStream not supported");

      // Читаем поток частями
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-primary-foreground">
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow bg-card font-sans">
        <h1 className="text-2xl text-primary font-bold mb-6">Шаг 1:</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Загрузить документ (.txt, .md)</label>
              <Input
              type="file"
              accept=".txt,.md,.csv"
              className="max-w-fit text-muted-foreground"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Уточняющий промпт (необязательно)</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3"
              rows={5}
              placeholder="Например: Сделай акцент на практике, добавь раздел с ресурсами, план на 4 недели..."
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={loading || !file}
            className="w-full py-2 px-4 text-primary rounded-lg dark"
          >
            {loading ? "⏳ Генерация..." : "🚀 Сформировать план"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            ⚠️ {error}
          </div>
        )}
        {output && (
          <h1 className="mt-6 text-2xl text-primary font-bold mb-6">Шаг 2:</h1>
        )}

        {output && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {output}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}