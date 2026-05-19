import { NextRequest, NextResponse } from "next/server";
import { createCourse } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Название курса обязательно" },
        { status: 400 }
      );
    }

    const course = await createCourse(title, description);

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}