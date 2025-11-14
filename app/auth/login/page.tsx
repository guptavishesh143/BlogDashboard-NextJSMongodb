// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setname] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [createNewUser, setcreateNewUser] = useState(true);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/signin`,
//       { cache: "no-store", body: JSON.stringify({ email, password }) }
//     );
//     console.log("res", res);
//     // const result = await signIn("credentials", {
//     //   email,
//     //   password,
//     //   redirect: false,
//     // });

//     // if (result?.error) {
//     //   setError("Invalid credentials");
//     // } else {
//     //   router.push("/");
//     // }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             {createNewUser ? "Sign" : "Login"} in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             {createNewUser && (
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="name"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="name"
//                   value={name}
//                   onChange={(e) => setname(e.target.value)}
//                 />
//               </div>
//             )}
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {createNewUser ? "Sign In" : "Login In"}
//             </button>
//           </div>

//           <div className="text-sm text-center text-gray-600">
//             Demo credentials: admin@example.com / password
//           </div>
//         </form>
//         <div>
//           <h5 className="text-sm font-medium rounded-md text-black">
//             Do you want to {!createNewUser ? "Sign In" : "Login In"} click below
//             to switch ?
//           </h5>
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             onClick={() => {
//               setcreateNewUser(false);
//             }}
//           >
//             {!createNewUser ? "Sign In" : "Login In"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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

      // Store JWT token in localStorage for later API calls
      if (data.token) localStorage.setItem("token", data.token);

      alert(data.message || `${mode === "login" ? "Login" : "Register"} successful`);
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
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleJwtAuth}>
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
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
