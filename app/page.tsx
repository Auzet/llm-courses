"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StudyPlan } from "@/schemas/StudyPlanSchema";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function StudyPlanGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setPlan(null);
    setError("");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("prompt", prompt);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Ошибка сервера");

      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-muted">
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow bg-card font-sans">
        <h1 className="text-2xl text-primary font-bold mb-4">Шаг 1:</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Загрузить документ (.txt, .pdf, .docx)
            </label>
            <Input
              id="file-input"
              type="file"
              accept=".txt,.md,.csv, .pdf,.docx"
              className="max-w-fit text-muted-foreground hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <Button type="button" variant="outline">
              <label htmlFor="file-input">Выбрать файл</label>
            </Button>
            {file && (
              <span className="ml-3 text-sm text-muted-foreground">
                Выбрано: {file.name}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Уточняющий промпт (необязательно)
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-24 p-3"
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
          <div className="flex justify-center mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {plan && (
          <h1 className="mt-6 text-2xl text-primary font-bold mb-4">Шаг 2:</h1>
        )}

        {plan && (
          <div className="py-6 px-2 space-y-5">
            <div className="flex justify-between items-start border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">{plan.title}</h2>
            </div>

            {plan.phases.map((phase) => (
              <div key={phase.phase_number}>
                <Card className="mx-auto w-full bg-card">
                  <CardHeader className="">
                    <div className="flex justify-between">
                      <CardTitle>
                        Этап {phase.phase_number}: {phase.title}
                      </CardTitle>
                      <Button
                        size="icon"
                        variant={isEditing ?  "destructive" : "secondary" }
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardDescription>
                      <p className="text-sm">{phase.focus}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {phase.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 font-mono">
                            {i + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {isEditing && (
                    <Textarea
                      className="w-full min-h-24 p-3 mt-3"
                      placeholder="Например: Измени пункт 1 так, чтобы..."
                    ></Textarea>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
