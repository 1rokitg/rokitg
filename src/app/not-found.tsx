// Only rendered for a URL that matches neither the (marketing) nor (academy)
// route group, so it can't inherit either one's root layout — it supplies its
// own bare <html>/<body> instead of depending on shared CSS.
export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "#08090c",
          color: "#f4f6fb",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <span style={{ fontSize: 56, fontWeight: 800 }}>404</span>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Page Not Found</h1>
        <p style={{ color: "#9aa3b5", margin: 0 }}>
          The page you are looking for does not exist.
        </p>
        <a href="/" style={{ color: "#7dd3fc", marginTop: 12 }}>
          Back to rokitg.com
        </a>
      </body>
    </html>
  );
}
