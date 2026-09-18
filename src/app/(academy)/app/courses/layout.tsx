import styles from "./courses.module.scss";

export const metadata = {
  title: "Cursos | RokitG Academy",
  description: "Aprende, practica y sigue tu progreso en el aula de RokitG.",
};

// The sidebar, brand header, and global nav now live one level up in the
// academy root layout — this just supplies the courses section's own content styles.
export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} lang="es">
      {children}
    </div>
  );
}
