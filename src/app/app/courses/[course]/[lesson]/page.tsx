import { notFound, redirect } from "next/navigation";
import { getCourse } from "@/lib/courses";
import { hasCourseAccess } from "@/lib/entitlements";
import { getPrivyUserId } from "@/lib/privy-server";
import { LessonReader } from "@/components/courses/LessonReader";

export default async function LessonPage({
  params,
}: { params: Promise<{ course: string; lesson: string }> }) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((item) => item.slug === lessonSlug);
  if (!course || !lesson) notFound();

  if (lesson.preview || course.status === "demo") {
    return <LessonReader course={course} lesson={lesson} />;
  }

  if (course.status === "on-sale") {
    const privyUserId = await getPrivyUserId();
    const owns = privyUserId ? await hasCourseAccess(privyUserId, courseSlug) : false;
    if (!owns) redirect(`/app/courses/${courseSlug}`);
    return <LessonReader course={course} lesson={lesson} />;
  }

  notFound();
}
