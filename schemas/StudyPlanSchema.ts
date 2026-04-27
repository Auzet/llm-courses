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