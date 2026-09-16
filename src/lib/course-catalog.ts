import type { Course } from "./courses";

export type CourseSummary = Pick<
  Course,
  "slug" | "title" | "subtitle" | "category" | "level" | "status" | "plannedPrice"
> & {
  lessonCount: number;
  durationMinutes: number;
};

export function summarizeCourse(course: Course): CourseSummary {
  return {
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    category: course.category,
    level: course.level,
    status: course.status,
    plannedPrice: course.plannedPrice,
    lessonCount: course.lessons.length,
    durationMinutes: course.lessons.reduce((total, lesson) => total + lesson.minutes, 0),
  };
}

export function formatCoursePrice(price: NonNullable<Course["plannedPrice"]>) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 2,
  }).format(price.amountMinor / 100);
}
