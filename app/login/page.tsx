"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setErrorMsg("Invalid email or password.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#16172a] via-[#232541] to-[#170925] relative overflow-hidden">
      {/* Animated cinematic blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[15%] left-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-700/30 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="z-10 bg-[#18182a]/90 border border-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center backdrop-blur-md">
        {/* Brand */}
        <h1 className="mb-8 flex items-center select-none text-4xl font-extrabold text-pink-500 tracking-wide drop-shadow">
          Nyx<span className="text-indigo-400">Stream</span>
        </h1>
        <div className="text-lg font-semibold text-gray-50 mb-5">
          Sign in to your account
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            required
            autoFocus
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none border border-transparent focus:border-pink-500 transition"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none border border-transparent focus:border-pink-500 transition"
          />
          {errorMsg && (
            <div aria-live="polite" className="text-pink-400 text-center text-sm -mt-2">{errorMsg}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-600 to-indigo-500 hover:from-pink-700 hover:to-indigo-600 transition-all text-white font-bold py-3 rounded-lg mt-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 enabled:active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="w-full flex gap-3 mt-7">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 py-3 w-full rounded-lg bg-white hover:bg-gray-400 text-gray-800 font-bold shadow transition-all cursor-pointer"
          >
            <img src="/google-icon.svg" alt="" className="w-5 h-5" />
              Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 py-3 w-full rounded-lg bg-[#000] hover:bg-[#181825] text-white font-bold shadow transition-all cursor-pointer"
          >
            <img src="/github-icon.svg" alt="" className="w-5 h-5 invert" />
              GitHub
          </button>
        </div>

        <div className="mt-8 text-gray-400 text-sm text-center w-full">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push("/register")}
            className="text-indigo-400 hover:underline font-semibold transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
