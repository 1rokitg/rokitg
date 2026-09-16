import "server-only";

export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  preview: boolean;
  paragraphs: string[];
  exercise: string;
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  description: string;
  outcomes: string[];
  status: "demo" | "coming-soon" | "placeholder";
  plannedPrice?: { amountMinor: number; currency: "EUR" };
  lessons: Lesson[];
};

// Editorial demo content. No price, payment plan, or paid entitlement is implied.
export const courses: Course[] = [
  {
    slug: "tus-primeros-pasos",
    title: "Tus primeros pasos: guía desde cero",
    subtitle: "Un punto de partida para aprender con RokitG.",
    category: "Inicio",
    level: "Principiante",
    description:
      "Nuestro primer curso está en preparación. Mientras conectamos las lecciones, puedes unirte a Free Comm y probar el aula con el curso de muestra.",
    outcomes: [],
    status: "placeholder",
    plannedPrice: { amountMinor: 2000, currency: "EUR" },
    lessons: [],
  },
  {
    slug: "tu-sistema-de-aprendizaje",
    title: "Construye tu sistema de aprendizaje",
    subtitle: "De guardar contenido a ponerlo en práctica.",
    category: "Método",
    level: "Principiante",
    description:
      "Un recorrido de muestra para probar el aula: organiza tus notas, practica con intención y registra lo que has aprendido.",
    outcomes: [
      "Definir un objetivo concreto para cada sesión",
      "Convertir una lección en una pequeña práctica",
      "Mantener un registro de tu aprendizaje",
    ],
    status: "demo",
    lessons: [
      {
        slug: "elige-tu-objetivo",
        title: "Empieza con una pregunta",
        minutes: 4,
        preview: true,
        paragraphs: [
          "Antes de empezar una lección, escribe una pregunta que quieras poder responder al terminar. Una pregunta concreta te ayuda a distinguir lo esencial de lo accesorio.",
          "Por ejemplo, si estás aprendiendo una herramienta, elige una tarea pequeña que quieras completar con ella. Reserva un espacio para anotar qué entiendes y qué necesitas volver a consultar.",
        ],
        exercise:
          "Escribe una pregunta y una tarea que puedas completar durante tu próxima sesión de aprendizaje.",
      },
      {
        slug: "ponlo-en-practica",
        title: "De la nota a la práctica",
        minutes: 5,
        preview: true,
        paragraphs: [
          "Después de leer una explicación, intenta reproducir una parte sin mirar tus notas. El objetivo de esta práctica es detectar dónde necesitas ayuda.",
          "Cuando algo no salga como esperabas, registra el paso que te bloqueó. Vuelve a esa parte de la lección y repite la tarea con un ejemplo distinto.",
        ],
        exercise:
          "Elige una idea de la sesión anterior y crea un ejemplo propio. Anota qué paso te resultó más difícil.",
      },
      {
        slug: "registra-tu-progreso",
        title: "Cierra el ciclo",
        minutes: 3,
        preview: true,
        paragraphs: [
          "Al terminar, escribe tres líneas: qué intentaste, qué aprendiste y cuál será tu siguiente paso. Este registro hace que la próxima sesión empiece con una dirección clara.",
          "Completar una lección es una referencia de tu actividad. Vuelve a practicar cuando quieras comprobar que puedes aplicar lo aprendido.",
        ],
        exercise:
          "Crea tu primera entrada de aprendizaje y elige una fecha para volver a practicar.",
      },
    ],
  },
  {
    slug: "automatizaciones-con-proposito",
    title: "Automatizaciones con propósito",
    subtitle: "Diseña procesos que trabajen contigo.",
    category: "Software",
    level: "Principiante",
    description:
      "Propuesta de curso sobre organización de procesos y herramientas. El temario y las inscripciones todavía no están disponibles.",
    outcomes: [
      "Identificar tareas repetitivas",
      "Dibujar un proceso sencillo",
      "Comprobar los resultados de una automatización",
    ],
    status: "coming-soon",
    lessons: [],
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}
export function courseMinutes(course: Course) {
  return course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}
