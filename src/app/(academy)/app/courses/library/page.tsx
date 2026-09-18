import { CourseLibrary } from "@/components/courses/CourseLibrary";
import { courses } from "@/lib/courses";
export default function LibraryPage() {
  return <CourseLibrary courses={courses.filter((course) => course.status === "demo")} />;
}
