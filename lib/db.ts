import { configDotenv } from "dotenv";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";
import { StudyPlanSchema } from "@/schemas/StudyPlanSchema";

configDotenv();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function createCourse(title: string, description?: string) {
  return await prisma.course.create({
    data: {
      title,
      description: description || null,
    },
  });
}

// Тип для входных данных (без id и версий, они генерируются)
export type CreatePlanInput = {
  courseId: string;
  content: z.infer<typeof StudyPlanSchema>;
};

export async function saveStudyPlan({ courseId, content }: CreatePlanInput) {
  // 1. Валидация структуры перед записью в БД (дополнительная защита)
  const validatedContent = StudyPlanSchema.parse(content);

  // 2. Проверяем, существует ли уже план у этого курса
  const existingPlan = await prisma.studyPlan.findUnique({
    where: { courseId },
  });

  if (existingPlan) {
    return await prisma.studyPlan.update({
      where: { id: existingPlan.id },
      data: {
        title: validatedContent.title,
        content: validatedContent as any, // Prisma принимает Json как any/unknown
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  } else {
    return await prisma.studyPlan.create({
      data: {
        courseId,
        title: validatedContent.title,
        content: validatedContent as any,
        version: 1,
      },
    });
  }
}

// Получает план по ID курса
export async function getStudyPlanByCourseId(courseId: string) {
  return await prisma.studyPlan.findUnique({
    where: { courseId },
  });
}
