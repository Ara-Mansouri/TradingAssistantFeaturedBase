"use client";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { email, password, setEmail, setPassword, handleLogin, loading, error } = useLogin();

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1115]/90 backdrop-blur-sm p-6 md:p-8 shadow-xl shadow-black/30">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 md:mb-8">
        Login
      </h1>

      <label className="block text-sm text-white/70 mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
        className="w-full mb-6 px-4 py-3 rounded-xl bg-[#141518] text-white
        placeholder-white/50 border border-white/10 focus:outline-none
        focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
      />

      <label className="block text-sm text-white/70 mb-2">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#141518] text-white
        placeholder-white/50 border border-white/10 focus:outline-none
        focus:ring-2 focus:ring-red-500/50 focus:border-transparent"
      />
                    <div className="flex flex-wrap gap-3 justify-between text-sm text-white/70 mb-6">
                <a href="#" className="hover:text-white underline-offset-4 hover:underline">Register</a>
                <a href="#" className="hover:text-white underline-offset-4 hover:underline">Forgot Password?</a>
              </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold
        bg-[#D41414] hover:bg-[#b91010] transition focus:outline-none focus:ring-4 focus:ring-red-500/30"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
