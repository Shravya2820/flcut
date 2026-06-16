import { signIn } from "@/auth";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        <button
          className="px-4 py-2 rounded bg-black text-white"
          type="submit"
        >
          Sign in with Google
        </button>
      </form>
    </main>
  );
}