import { test } from "@/lib/constants";
import { Select } from "./ui/select";
import { Save, X, Pencil, Lightbulb } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function TestsEditor() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto py-6 px-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
          Этап 1
        </span>
        <h3 className="text-lg font-semibold text-gray-800">Вводный модуль</h3>
      </div>

      {test.questions.map((q, idx) => {
        const isEditing = false;

        return (
          <Card
            key={q.id}
            className={`transition-all duration-200 ${
              isEditing ? "border-primary/50 bg-accent/30" : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono text-muted-foreground mt-1">
                      #{idx + 1}
                    </span>
                    {isEditing ? (
                      <Textarea
                        className="text-sm font-medium h-auto resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                        rows={2}
                        placeholder="Текст вопроса..."
                      />
                    ) : (
                      <CardTitle className="text-base leading-snug">
                        {q.question}
                      </CardTitle>
                    )}
                  </div>
                </div>

                {/* Кнопки управления */}
                <div className="flex gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Варианты ответов */}
              <div className="space-y-2">
                {["A", "B", "C", "D"].map((label, i) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-muted-foreground my-auto w-4">
                      {label}.
                    </span>
                    {!isEditing ? (
                      <Input
                        className="text-sm h-8"
                        placeholder={`Вариант ${label}...`}
                      />
                    ) : (
                      <span className={`text-sm `}></span>
                    )}
                    {isEditing && (
                      <Select>
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue placeholder="Ответ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="correct">Правильный</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {/* {!isEditing && current.options[i] === current.correct_answer && (
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    )} */}
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              {/* Объяснение */}
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  {isEditing ? (
                    <Textarea
                      className="text-xs h-auto resize-none"
                      rows={2}
                      placeholder="Объяснение правильного ответа..."
                    />
                  ) : (
                    <CardDescription className="text-xs text-muted-foreground">
                      {q.explanation}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardContent>

            {isEditing && (
              <CardFooter className="border-t pt-3 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <X className="w-3 h-3 mr-1" /> Отмена
                </Button>
                <Button size="sm">
                  <Save className="w-3 h-3 mr-1" /> Сохранить
                </Button>
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}
