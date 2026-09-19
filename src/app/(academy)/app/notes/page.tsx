import { NotesList } from "@/components/courses/NotesList";
import { courses } from "@/lib/courses";
export default function NotesPage() {
  return <NotesList courses={courses} />;
}
