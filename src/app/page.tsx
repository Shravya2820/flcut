import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Card */}
        <div
          className="card card-lg"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "var(--accent-coral)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "24px",
            }}
          >
            ✂️
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>FLCut</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            URL Management Platform
          </p>

          {/* Description */}
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" }}>
            Manage, track, and optimize your shortened links. Built for the Finite Loop Club community.
          </p>

          {/* Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "/dashboard",
              });
            }}
            style={{ width: "100%" }}
          >
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Footer */}
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "24px" }}>
            Authorized users only. Managed by Finite Loop Club.
          </p>
        </div>
      </div>
    </main>
  );
}