"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJwtAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "login" : "register";
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
     router.push("/dashboard"); // Redirect to dashboard or posts page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextAuthLogin = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 md:hidden"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleJwtAuth}>
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login with Email"
              : "Register with Email"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">or</div>

        {/* NextAuth Login Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleNextAuthLogin("google")}
            className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Sign in with Google
          </button>

          <button
            onClick={() => handleNextAuthLogin("github")}
            className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Sign in with GitHub
          </button>
        </div>

        <div className="text-sm text-center text-gray-700">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-indigo-600 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
