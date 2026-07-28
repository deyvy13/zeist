import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zeist — Software e ingeniería de sistemas con IA";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1200px 600px at 100% 0%, rgba(0,255,206,0.35), transparent), #060b0a",
          color: "#eaf5f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg,#00FFCE,#00CCA5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#051010",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            Z
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            Zeist
            <span style={{ color: "#00FFCE" }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Software que impulsa tu negocio.
          </div>
          <div style={{ fontSize: 34, color: "#00FFCE", fontWeight: 700 }}>
            Con IA. Más rápido. Más accesible.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
