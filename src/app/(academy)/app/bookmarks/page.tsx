import { BookmarksList } from "@/components/courses/BookmarksList";
import { courses } from "@/lib/courses";
export default function BookmarksPage() {
  return <BookmarksList courses={courses} />;
}
