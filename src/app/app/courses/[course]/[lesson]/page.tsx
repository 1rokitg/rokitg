import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import { LessonReader } from "@/components/courses/LessonReader";

export default async function LessonPage({
  params,
}: { params: Promise<{ course: string; lesson: string }> }) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((item) => item.slug === lessonSlug);
  // V0 only serves public demo lessons. Future paid lessons require server-verified access.
  if (!course || !lesson || !lesson.preview || course.status !== "demo") notFound();
  return <LessonReader course={course} lesson={lesson} />;
}
