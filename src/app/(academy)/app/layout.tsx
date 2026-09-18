import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";
import { Providers } from "@/components/Providers";
import { AppAuthProvider } from "@/components/AppAuthProvider";
import { AcademySidebar } from "@/components/academy/AcademySidebar";
import { InteractionTracker } from "@/components/InteractionTracker";
import { WhopPixelScripts } from "@/components/WhopPixelScripts";
import { getWhopPixelContext } from "@/lib/whop-pixel";
import { courses } from "@/lib/courses";
import { fonts, style, dataStyle } from "@/resources";
import styles from "@/components/academy/AcademySidebar.module.scss";

export const metadata = {
  title: "RokitG Academy",
  description: "Aprende, practica y avanza a tu ritmo — la academia de RokitG.",
};

export default async function AcademyRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { loadWhop, shouldTrack, whopContext } = await getWhopPixelContext();
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);

  return (
    <html
      suppressHydrationWarning
      lang="es"
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="academy-theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  const savedTheme = localStorage.getItem('data-theme');
                  root.setAttribute('data-theme', resolveTheme(savedTheme));
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <WhopPixelScripts loadWhop={loadWhop} whopContext={whopContext} />
      </head>
      <body style={{ margin: 0 }}>
        <Providers>
          <AppAuthProvider>
            {shouldTrack && <InteractionTracker />}
            <div className={styles.shell}>
              <AcademySidebar totalLessons={totalLessons} />
              <main className={styles.main}>{children}</main>
            </div>
          </AppAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
