import { z } from "zod";

export const StudyPlanSchema = z.object({
  title: z.string().describe("Название учебного плана"),
  phases: z.array(
    z.object({
      phase_number: z.number().describe("Номер этапа"),
      title: z.string().describe("Название этапа"),
      focus: z.string().describe("Основной фокус этапа"),
      steps: z.array(z.string()).describe("Конкретные шаги (3-7 пунктов)")
    })
  )
});

export type StudyPlan = z.infer<typeof StudyPlanSchema>;

export type Phase = {
  phase_number: number;
  title: string;
  focus: string;
  steps: string[];
};

export type TestQuestion = {
  id: number;
  question: string;
  options: [string, string, string, string]; // кортеж из 4 строк
  correct_answer: string;
  explanation: string;
};

export type StudyTest = {
  phase_title: string;
  questions: TestQuestion[];
};

type StudyTestViewerProps = {
  test: StudyTest;
  onChange: (test: StudyTest) => void;
  phaseNumber?: number;
};