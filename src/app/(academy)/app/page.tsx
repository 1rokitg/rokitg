import { courses } from "@/lib/courses";
import { summarizeCourse } from "@/lib/course-catalog";
import { AcademyHome } from "@/components/academy/AcademyHome";

export const metadata = {
  title: "Dashboard | RokitG Academy",
  description: "A focused learning space for beginner traders.",
};

export default function AppHomePage() {
  return <AcademyHome courses={courses.map(summarizeCourse)} />;
}
